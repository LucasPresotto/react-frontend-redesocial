import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useAuthFetch } from "../hooks/useAuthFetch";
import Toast from "./Toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const DenunciaModal = ({ show, handleClose, alvo }) => {
    const [motivo, setMotivo] = useState("");
    const [toastInfo, setToastInfo] = useState(null);
    const authFetch = useAuthFetch();

    const handleSubmit = async () => {
        if (!motivo.trim()) {
            setToastInfo({ msg: "Escreva um motivo.", type: "warning" });
            return;
        }

        const payload = {
            motivo,
            post_id: alvo.tipo === 'post' ? alvo.id : undefined,
            comentario_id: alvo.tipo === 'comentario' ? alvo.id : undefined,
            usuario_id: alvo.tipo === 'usuario' ? alvo.id : undefined,
        };

        try {
            const res = await authFetch(`${API_BASE_URL}/api/denuncias`, {
                method: "POST",
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                setToastInfo({ msg: "Denúncia enviada. Obrigado por colaborar.", type: "success" });
                setTimeout(() => {
                    handleClose();
                    setToastInfo(null);
                }, 2000);
                setMotivo("");
            } else {
                setToastInfo({ msg: "Erro ao enviar denúncia.", type: "danger" });
            }
        } catch (error) {
            console.error(error);
            setToastInfo({ msg: "Erro de comunicação.", type: "danger" });
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
                    <Modal.Title>Denunciar {alvo.tipo}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Por que você está denunciando isso?</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows={3} 
                            placeholder="Conteúdo ofensivo, spam, etc..."
                            value={motivo}
                            onChange={e => setMotivo(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
                    <Button variant="danger" onClick={handleSubmit}>Enviar Denúncia</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};
export default DenunciaModal;