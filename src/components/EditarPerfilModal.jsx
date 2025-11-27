import { useState, useRef } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useAuthFetch } from "../hooks/useAuthFetch";

const EditarPerfilModal = ({ show, handleClose, perfil, onUpdate }) => {
    const [nome, setNome] = useState(perfil.nome);
    const [bio, setBio] = useState(perfil.bio || "");
    const [foto, setFoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const authFetch = useAuthFetch();

    const handleSave = async () => {
        setLoading(true);
        try {
            // 1. Atualizar textos
            const resTexto = await authFetch("http://localhost:3000/api/usuarios/me", {
                method: "PATCH",
                body: JSON.stringify({ nome, bio }),
            });
            let dadosAtualizados = await resTexto.json();

            // 2. Atualizar foto (se houver)
            if (foto) {
                const formData = new FormData();
                formData.append("foto_perfil", foto);
                const resFoto = await authFetch("http://localhost:3000/api/usuarios/foto", {
                    method: "POST",
                    body: formData, // AuthFetch lida com headers automaticamente, exceto content-type para FormData
                });
                const dadosFoto = await resFoto.json();
                dadosAtualizados = { ...dadosAtualizados, ...dadosFoto };
            }

            onUpdate(dadosAtualizados);
            handleClose();
        } catch (error) {
            alert("Erro ao atualizar perfil");
        } finally {
            setLoading(false);
        }
    };

    return (
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
    );
};
export default EditarPerfilModal;