import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuthFetch } from "../hooks/useAuthFetch";
import { useCurrentUser } from "../hooks/useCurrentUser";
import Post from "../components/posts/Post";
import Comentario from "../components/posts/Comentario";
import Navbar from "../components/Navbar"; 

const PaginaPost = () => {
    const { id } = useParams();
    const user = useCurrentUser()();
    const authFetch = useAuthFetch();
    
    const [post, setPost] = useState(null);
    const [comentarios, setComentarios] = useState([]);
    const [novoComentario, setNovoComentario] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const resPost = await authFetch(`http://localhost:3000/api/posts/${id}`);
                if (!resPost.ok) return; 
                const dadosPost = await resPost.json();
                
                const resCom = await authFetch(`http://localhost:3000/api/posts/${id}/comentarios`);
                const dadosCom = resCom.ok ? await resCom.json() : [];
                
                setPost(dadosPost);
                setComentarios(dadosCom);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [id]);

    const enviarComentario = async (e) => {
        e.preventDefault();
        if(!novoComentario.trim()) return;

        const res = await authFetch("http://localhost:3000/api/comentarios", {
            method: "POST",
            body: JSON.stringify({ post_id: id, conteudo: novoComentario })
        });

        if(res.ok) {
            const novo = await res.json();
            novo.autor_nome = user.nome; 
            novo.autor_usuario = user.usuario;
            novo.autor_foto = user.url_perfil_foto;
            novo.Usuario_id = user.sub;
            
            setComentarios([...comentarios, novo]);
            setNovoComentario("");
        }
    };

    if (loading) return <div className="text-center mt-5">Carregando...</div>;
    if (!post) return <div className="text-center mt-5">Post não encontrado.</div>;

    return (
        <div className="min-vh-100 pb-5">
            <div className="container mt-4" style={{maxWidth: "600px"}}>
                <Post 
                    post={post} 
                    isFullPage={true} 
                    onDelete={() => window.history.back()} 
                />

                <div className="card border-0 shadow-sm p-3 mb-3">
                    <form onSubmit={enviarComentario} className="d-flex gap-2 align-items-start">
                        <img src={user.url_perfil_foto || "https://placehold.co/40"} className="rounded-circle" width="40" height="40" style={{objectFit:'cover'}} />
                        <div className="w-100">
                            <textarea 
                                className="form-control border-0 bg-body mb-2" 
                                rows="2" 
                                placeholder="Digite seu comentário"
                                value={novoComentario}
                                onChange={e => setNovoComentario(e.target.value)}
                                style={{resize:'none'}}
                            />
                            <div className="text-end">
                                <button className="btn btn-primary rounded-pill btn-sm fw-bold px-3" disabled={!novoComentario.trim()}>Comentar</button>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="mb-5">
                    {comentarios.map(c => (
                        <Comentario 
                            key={c.id} 
                            comentario={c} 
                            onDelete={(cid) => setComentarios(comentarios.filter(x => x.id !== cid))} 
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
export default PaginaPost;