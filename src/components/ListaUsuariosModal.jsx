import { Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const ListaUsuariosModal = ({ show, handleClose, titulo, usuarios }) => {
    return (
        <Modal show={show} onHide={handleClose} centered scrollable>
            <Modal.Header closeButton>
                <Modal.Title>{titulo}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {usuarios.length === 0 ? (
                    <div className="text-center text-muted py-3">Nenhum usuário encontrado.</div>
                ) : (
                    <div className="list-group list-group-flush">
                        {usuarios.map(u => (
                            <Link 
                                key={u.id} 
                                to={`/perfil/${u.id}`} 
                                className="list-group-item list-group-item-action d-flex align-items-center gap-2 border-0"
                                onClick={handleClose} // Fecha o modal ao clicar no usuário
                            >
                                <img 
                                    src={u.url_perfil_foto || "https://placehold.co/40"} 
                                    className="rounded-circle" 
                                    width="40" height="40" 
                                    style={{objectFit: 'cover'}} 
                                />
                                <div>
                                    <div className="fw-bold text-body">{u.nome}</div>
                                    <small className="text-muted">@{u.usuario}</small>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default ListaUsuariosModal;