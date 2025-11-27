import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthFetch } from "../hooks/useAuthFetch";
import { useCurrentUser } from "../hooks/useCurrentUser";
import Comentario from "./Comentario";
import DenunciaModal from "./DenunciaModal";

const Post = ({ post, onDelete, onUpdate }) => {
    const user = useCurrentUser()();
    const authFetch = useAuthFetch();
    
    const [likes, setLikes] = useState(post.total_likes);
    const [curtido, setCurtido] = useState(post.curtido_por_mim);
    const [editando, setEditando] = useState(false);
    const [novoConteudo, setNovoConteudo] = useState(post.conteudo);

    const [mostrarComentarios, setMostrarComentarios] = useState(false);
    const [listaComentarios, setListaComentarios] = useState([]);
    const [textoComentario, setTextoComentario] = useState("");
    const [totalComentarios, setTotalComentarios] = useState(post.total_comentarios);
    const [showDenuncia, setShowDenuncia] = useState(false);

    const isDono = user?.sub === post.Usuario_id || user?.papel === 1;

    const toggleLike = async () => {
        const method = curtido ? "DELETE" : "POST";
        const res = await authFetch(`http://localhost:3000/api/likes/posts/${post.id}`, { method });
        if (res.ok) {
            setCurtido(!curtido);
            setLikes(prev => curtido ? prev - 1 : prev + 1);
        }
    };

    const carregarComentarios = async () => {
        if (!mostrarComentarios) {
            const res = await authFetch(`http://localhost:3000/api/posts/${post.id}/comentarios`);
            if (res.ok) {
                setListaComentarios(await res.json());
            }
        }
        setMostrarComentarios(!mostrarComentarios);
    };

    const enviarComentario = async (e) => {
        e.preventDefault();
        if(!textoComentario.trim()) return;

        const res = await authFetch("http://localhost:3000/api/comentarios", {
            method: "POST",
            body: JSON.stringify({ post_id: post.id, conteudo: textoComentario })
        });

        if(res.ok) {
            const novo = await res.json();
            // Adiciona dados mockados do autor para exibir instantaneamente sem reload
            novo.autor_nome = user.nome; 
            novo.autor_usuario = user.usuario;
            novo.autor_foto = user.url_perfil_foto;
            novo.Usuario_id = user.sub;
            
            setListaComentarios([...listaComentarios, novo]);
            setTextoComentario("");
            setTotalComentarios(prev => prev + 1);
        }
    };

    const handleUpdate = async () => {
        const res = await authFetch(`http://localhost:3000/api/posts/${post.id}`, {
            method: "PATCH",
            body: JSON.stringify({ conteudo: novoConteudo })
        });
        if (res.ok) {
            setEditando(false);
            onUpdate && onUpdate({ ...post, conteudo: novoConteudo });
        }
    };

    const handleDelete = async () => {
        if(!confirm("Tem certeza?")) return;
        const res = await authFetch(`http://localhost:3000/api/posts/${post.id}`, { method: "DELETE" });
        if (res.ok) onDelete(post.id);
    };

    return (
        <article className="card mb-3 border-0 shadow-sm">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="d-flex gap-2">
                        <Link to={`/perfil/${post.Usuario_id}`}>
                            <img src={post.autor_foto || "https://placehold.co/50"} className="rounded-circle" width="50" height="50" alt={post.autor_nome} />
                        </Link>
                        <div>
                            <Link to={`/perfil/${post.Usuario_id}`} className="text-decoration-none text-body fw-bold">
                                {post.autor_nome}
                            </Link>
                            <div className="text-muted small">@{post.autor_usuario}</div>
                        </div>
                    </div>
                    <div className="dropdown">
                        <button className="btn btn-link text-muted p-0" data-bs-toggle="dropdown">•••</button>
                        <ul className="dropdown-menu">
                            {isDono ? (
                                <>
                                    <li><button className="dropdown-item" onClick={() => setEditando(true)}>Editar</button></li>
                                    <li><button className="dropdown-item text-danger" onClick={handleDelete}>Excluir</button></li>
                                </>
                            ) : (
                                <li>
                                    <button className="dropdown-item text-warning" onClick={() => setShowDenuncia(true)}>
                                        ⚠️ Denunciar Post
                                    </button>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                {editando ? (
                    <div className="mb-2">
                        <textarea className="form-control mb-2" value={novoConteudo} onChange={e => setNovoConteudo(e.target.value)} />
                        <button className="btn btn-sm btn-success me-2" onClick={handleUpdate}>Salvar</button>
                        <button className="btn btn-sm btn-secondary" onClick={() => setEditando(false)}>Cancelar</button>
                    </div>
                ) : (
                    <p className="card-text mb-2" style={{whiteSpace: 'pre-wrap'}}>{editando ? novoConteudo : post.conteudo}</p>
                )}

                {post.url_arquivo && (
                    <div className="mb-3">
                        {post.tipo === 2 ? (
                            <video src={post.url_arquivo} controls className="img-fluid rounded w-100" />
                        ) : (
                            <img src={post.url_arquivo} className="img-fluid rounded w-100" alt="Mídia" style={{maxHeight: "500px", objectFit: "contain", backgroundColor: "#000"}} />
                        )}
                    </div>
                )}

                {/* Botões de Ação */}
                <div className="d-flex gap-4 text-muted border-top pt-2">
                    <button onClick={carregarComentarios} className="btn btn-sm border-0 text-muted d-flex align-items-center gap-1">
                        💬 <span>{totalComentarios}</span>
                    </button>
                    <button onClick={toggleLike} className={`btn btn-sm border-0 d-flex align-items-center gap-1 ${curtido ? 'text-danger' : 'text-muted'}`}>
                        {curtido ? '❤' : '♡'} <span>{likes}</span>
                    </button>
                </div>

                {/* Área de Comentários */}
                {mostrarComentarios && (
                    <div className="mt-3 pt-3 border-top">
                        <form onSubmit={enviarComentario} className="d-flex gap-2 mb-3">
                            <input 
                                className="form-control form-control-sm rounded-pill" 
                                placeholder="Postar sua resposta" 
                                value={textoComentario}
                                onChange={e => setTextoComentario(e.target.value)}
                            />
                            <button className="btn btn-sm btn-primary rounded-pill" disabled={!textoComentario.trim()}>Responder</button>
                        </form>
                        
                        <div className="d-flex flex-column gap-2">
                            {listaComentarios.map(c => (
                                <Comentario 
                                    key={c.id} 
                                    comentario={c} 
                                    onDelete={(id) => {
                                        setListaComentarios(prev => prev.filter(x => x.id !== id));
                                        setTotalComentarios(prev => prev - 1);
                                    }} 
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <DenunciaModal 
                show={showDenuncia} 
                handleClose={() => setShowDenuncia(false)} 
                alvo={{ tipo: 'post', id: post.id }}
            />
        </article>
    );
};
export default Post;