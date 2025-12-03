import { useState } from "react";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuthFetch } from "../../hooks/useAuthFetch";
import { useCurrentUser } from "../../hooks/useCurrentUser";

const ItemUsuario = ({ u, onClose }) => {
    const user = useCurrentUser()();
    const authFetch = useAuthFetch();
    const [seguindo, setSeguindo] = useState(u.seguido_por_mim);
    const isMe = user?.sub === u.id;

    const handleFollow = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const method = seguindo ? "DELETE" : "POST";
        const res = await authFetch(`http://localhost:3000/api/seguidores/${u.id}`, { method });
        if(res.ok) setSeguindo(!seguindo);
    };

    return (
        <div className="list-group-item d-flex align-items-center justify-content-between border-0 px-0">
            <Link to={`/perfil/${u.id}`} className="d-flex align-items-center gap-2 text-decoration-none text-body" onClick={onClose}>
                <img src={u.url_perfil_foto || "https://placehold.co/40"} className="rounded-circle" width="40" height="40" style={{objectFit: 'cover'}} />
                <div>
                    <div className="fw-bold">{u.nome}</div>
                    <small className="text-secondary">@{u.usuario}</small>
                </div>
            </Link>
            
            {!isMe && (
                <button 
                    className={`btn btn-sm rounded-pill fw-bold ${seguindo ? 'btn-outline-danger' : 'btn-dark'}`}
                    onClick={handleFollow}
                    style={{minWidth: '80px'}}
                >
                    {seguindo ? "Seguindo" : "Seguir"}
                </button>
            )}
        </div>
    );
}

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
                            <ItemUsuario key={u.id} u={u} onClose={handleClose} />
                        ))}
                    </div>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default ListaUsuariosModal;