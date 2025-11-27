import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useAuthFetch } from "../hooks/useAuthFetch";

const DenunciaModal = ({ show, handleClose, alvo }) => {
    // alvo = { tipo: 'post'|'comentario'|'usuario', id: number }
    const [motivo, setMotivo] = useState("");
    const authFetch = useAuthFetch();

    const handleSubmit = async () => {
        if (!motivo.trim()) return alert("Escreva um motivo.");

        const payload = {
            motivo,
            post_id: alvo.tipo === 'post' ? alvo.id : undefined,
            comentario_id: alvo.tipo === 'comentario' ? alvo.id : undefined,
            usuario_id: alvo.tipo === 'usuario' ? alvo.id : undefined,
        };

        try {
            const res = await authFetch("http://localhost:3000/api/denuncias", {
                method: "POST",
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                alert("Denúncia enviada. Obrigado por colaborar.");
                handleClose();
                setMotivo("");
            } else {
                alert("Erro ao enviar denúncia.");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
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
    );
};
export default DenunciaModal;