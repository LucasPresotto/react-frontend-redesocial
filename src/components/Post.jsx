import { useState, useEffect } from "react";
import { useAuthFetch } from "../hooks/useAuthFetch";
import { useCurrentUser } from "../hooks/useCurrentUser";

const Post = ({ post, onDelete }) => {
    const [comentarios, setComentarios] = useState([]);
    const [novoComentario, setNovoComentario] = useState("");
    const [mostrarComentarios, setMostrarComentarios] = useState(false);
    const authFetch = useAuthFetch();
    const getUser = useCurrentUser();
    const user = getUser();

    // Busca comentários quando o usuário expande
    useEffect(() => {
        if (mostrarComentarios) {
            authFetch(`http://localhost:3000/api/posts/${post.id}/comentarios`)
                .then(res => res.json())
                .then(data => setComentarios(data))
                .catch(err => console.error(err));
        }
    }, [mostrarComentarios, post.id]);

    const handleLike = async () => {
        // Implementação simples: apenas chama a API. 
        // Idealmente atualizaria o contador visualmente.
        await authFetch(`http://localhost:3000/api/likes/posts/${post.id}`, { method: "POST" });
        alert("Curtiu!");
    };

    const handleComentar = async (e) => {
        e.preventDefault();
        if (!novoComentario.trim()) return;
        
        try {
            const res = await authFetch("http://localhost:3000/api/comentarios", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ post_id: post.id, conteudo: novoComentario })
            });
            if (res.ok) {
                const comentarioCriado = await res.json();
                // Adiciona na lista local para feedback imediato (falta dados do autor no retorno do POST, mas ok para MVP)
                setComentarios([...comentarios, { ...comentarioCriado, autor_nome: user.nome }]); 
                setNovoComentario("");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async () => {
        if(!confirm("Tem certeza?")) return;
        const res = await authFetch(`http://localhost:3000/api/posts/${post.id}`, { method: "DELETE" });
        if (res.ok) onDelete(post.id);
    };

    const isDono = user?.sub === post.Usuario_id;

    return (
        <div className="card mb-3">
            <div className="card-header d-flex justify-content-between">
                <div>
                    <strong>{post.autor_nome}</strong> <span className="text-muted">@{post.autor_usuario}</span>
                </div>
                {isDono && <button className="btn btn-sm btn-danger" onClick={handleDelete}>Excluir</button>}
            </div>
            <div className="card-body">
                <p className="card-text">{post.conteudo}</p>
                {post.url_arquivo && (
                    <img src={post.url_arquivo} className="img-fluid rounded mb-3" alt="Post" style={{maxHeight: "400px"}}/>
                )}
                
                <div className="d-flex gap-2">
                    <button className="btn btn-outline-primary btn-sm" onClick={handleLike}>👍 Curtir</button>
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => setMostrarComentarios(!mostrarComentarios)}>
                        💬 Comentários
                    </button>
                </div>
            </div>
            
            {mostrarComentarios && (
                <div className="card-footer bg-light">
                    {comentarios.map(c => (
                        <div key={c.id} className="mb-2 border-bottom pb-1">
                            <strong>{c.autor_nome}:</strong> {c.conteudo}
                        </div>
                    ))}
                    <form onSubmit={handleComentar} className="d-flex gap-2 mt-2">
                        <input 
                            type="text" 
                            className="form-control form-control-sm" 
                            placeholder="Escreva um comentário..." 
                            value={novoComentario}
                            onChange={e => setNovoComentario(e.target.value)}
                        />
                        <button type="submit" className="btn btn-sm btn-primary">Enviar</button>
                    </form>
                </div>
            )}
        </div>
    );
};
export default Post;