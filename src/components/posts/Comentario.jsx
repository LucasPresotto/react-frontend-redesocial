import { useState } from "react";
import { Link } from "react-router-dom";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useAuthFetch } from "../../hooks/useAuthFetch";
import DenunciaModal from "../DenunciaModal";
import { FaRegHeart, FaHeart } from "react-icons/fa";

const Comentario = ({ comentario, onDelete }) => {
    const user = useCurrentUser()();
    const authFetch = useAuthFetch();
    const [editando, setEditando] = useState(false);
    const [texto, setTexto] = useState(comentario.conteudo);
    const [likes, setLikes] = useState(comentario.total_likes || 0);
    const [curtido, setCurtido] = useState(comentario.curtido_por_mim || false);
    const [showDenuncia, setShowDenuncia] = useState(false);

    const isDono = user?.sub === comentario.Usuario_id || user?.papel === 1;

    const handleUpdate = async () => {
        const res = await authFetch(`http://localhost:3000/api/comentarios/${comentario.id}`, {
            method: "PUT", 
            body: JSON.stringify({ conteudo: texto })
        });
        if (res.ok) setEditando(false);
    };

    const handleDelete = async () => {
        if(!confirm("Apagar comentário?")) return;
        const res = await authFetch(`http://localhost:3000/api/comentarios/${comentario.id}`, { method: "DELETE" });
        if(res.ok) onDelete(comentario.id);
    };

    const toggleLike = async () => {
        const method = curtido ? "DELETE" : "POST";
        setCurtido(!curtido);
        setLikes(prev => curtido ? prev - 1 : prev + 1);

        try {
            const res = await authFetch(`http://localhost:3000/api/likes/comentarios/${comentario.id}`, { method });
            if (!res.ok) {
                setCurtido(curtido);
                setLikes(prev => curtido ? prev + 1 : prev - 1);
            }
        } catch (error) {
            console.error(error);
            setCurtido(curtido);
            setLikes(prev => curtido ? prev + 1 : prev - 1);
        }
    };

    return (
        <div className="d-flex gap-2 p-2 border-bottom border-secondary-subtle">
            <Link to={`/perfil/${comentario.Usuario_id}`}>
                <img src={comentario.autor_foto || "https://placehold.co/40"} className="rounded-circle" width="40" height="40" style={{objectFit:"cover"}} />
            </Link>
            <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <Link to={`/perfil/${comentario.Usuario_id}`} className="fw-bold text-body text-decoration-none me-1">
                            {comentario.autor_nome}
                        </Link>
                        <span className="text-muted small">@{comentario.autor_usuario}</span>
                    </div>
                        <div className="dropdown">
                            <button className="btn btn-sm btn-link text-muted py-0" data-bs-toggle="dropdown">⋮</button>
                            <ul className="dropdown-menu">
                                {isDono ? (
                                    <>
                                        <li><button className="dropdown-item" onClick={() => setEditando(true)}>Editar</button></li>
                                        <li><button className="dropdown-item text-danger" onClick={handleDelete}>Excluir</button></li>
                                    </>
                                ):(
                                    <li>
                                        <button className="dropdown-item text-warning" onClick={() => setShowDenuncia(true)}>
                                            ⚠️ Denunciar
                                        </button>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>

                {editando ? (
                    <div className="mt-1">
                        <input className="form-control form-control-sm mb-1" value={texto} onChange={e => setTexto(e.target.value)} />
                        <button className="btn btn-sm btn-primary me-1" onClick={handleUpdate}>Salvar</button>
                        <button className="btn btn-sm btn-secondary" onClick={() => setEditando(false)}>Cancelar</button>
                    </div>
                ) : (
                    <p className="mb-0 small">{texto}</p>
                )}

                <div className="d-flex align-items-center">
                    <button 
                        className={`btn btn-sm border-0 p-0 d-flex align-items-center gap-1 ${curtido ? 'text-danger' : 'text-secondary'}`} 
                        onClick={toggleLike}
                        style={{fontSize: "0.85rem"}}
                    >
                        {curtido ? <FaHeart /> : <FaRegHeart />} <span>{likes || "0"}</span>
                    </button>
                </div>
            </div>
            <DenunciaModal 
                show={showDenuncia} 
                handleClose={() => setShowDenuncia(false)} 
                alvo={{ tipo: 'comentario', id: comentario.id }}
            />
        </div>
    );
};
export default Comentario;