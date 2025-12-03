import { useState, useRef } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useAuthFetch } from "../../hooks/useAuthFetch";
import Toast from "../../components/Toast";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../hooks/AuthContext";

const EditarPerfilModal = ({ show, handleClose, perfil, onUpdate }) => {
    const [nome, setNome] = useState(perfil.nome);
    const [bio, setBio] = useState(perfil.bio || "");
    const [foto, setFoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [toastInfo, setToastInfo] = useState(null);
    const authFetch = useAuthFetch();
    const { updateUser } = useAuth();

    const handleSave = async () => {
        setLoading(true);
        try {
            const resTexto = await authFetch("http://localhost:3000/api/usuarios/me", {
                method: "PATCH",
                body: JSON.stringify({ nome, bio }),
            });
            let dadosAtualizados = await resTexto.json();

            if (foto) {
                const formData = new FormData();
                formData.append("foto_perfil", foto);
                const resFoto = await authFetch("http://localhost:3000/api/usuarios/foto", {
                    method: "POST",
                    body: formData, 
                });
                const dadosFoto = await resFoto.json();
                dadosAtualizados = { ...dadosAtualizados, ...dadosFoto };
            }

            const refreshRes = await fetch("http://localhost:3000/api/usuarios/refresh", {
                method: "POST",
                credentials: "include" 
            });
            
            if (refreshRes.ok) {
                const data = await refreshRes.json();
                if (data.access_token) {
                    sessionStorage.setItem("at", data.access_token);
                    window.dispatchEvent(new Event("auth-change"));
                }
            }

            onUpdate(dadosAtualizados);

            updateUser({
                nome: dadosAtualizados.nome,
                url_perfil_foto: dadosAtualizados.url_perfil_foto
            });

            setToastInfo({ msg: "Perfil atualizado com sucesso!", type: "success" });
            
            setTimeout(() => {
                handleClose();
                setToastInfo(null);
            }, 1500);
        } catch (error) {
            setToastInfo({ msg: "Erro ao atualizar perfil", type: "danger" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {toastInfo && (
                <Toast 
                    message={toastInfo.msg} 
                    type={toastInfo.type} 
                    onClose={() => setToastInfo(null)} 
                />
            )}
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Perfil</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className="text-center mb-3">
                            <img 
                                src={foto ? URL.createObjectURL(foto) : (perfil.url_perfil_foto || "https://placehold.co/100")} 
                                className="rounded-circle mb-2" 
                                width="80" height="80" 
                                style={{objectFit: 'cover'}} 
                            />
                            <Form.Control type="file" size="sm" onChange={e => setFoto(e.target.files[0])} />
                        </div>
                        <Form.Group className="mb-3">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control type="text" value={nome} onChange={e => setNome(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Bio</Form.Label>
                            <Form.Control as="textarea" rows={3} value={bio} onChange={e => setBio(e.target.value)} placeholder="Sobre você..." />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
                    <Button variant="dark" onClick={handleSave} disabled={loading}>
                        {loading ? "Salvando..." : "Salvar"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};
export default EditarPerfilModal;