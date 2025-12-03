import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuthFetch } from "../../hooks/useAuthFetch";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import Post from "../../components/posts/Post";
import EditarPerfilModal from "../../components/usuarios/EditarPerfilModal";
import ListaUsuariosModal from "../../components/usuarios/ListaUsuariosModal";
import { useNavigate } from "react-router-dom";
import DenunciaModal from "../../components/DenunciaModal";

const Perfil = () => {
    const { id } = useParams(); 
    const userLogado = useCurrentUser()();
    const authFetch = useAuthFetch();
    
    const [perfil, setPerfil] = useState(null);
    const [posts, setPosts] = useState([]);
    const [filtro, setFiltro] = useState("todos"); 
    const [seguindo, setSeguindo] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showLista, setShowLista] = useState(false); 
    const [tipoLista, setTipoLista] = useState(""); 
    const [usuariosLista, setUsuariosLista] = useState([]); 
    const [showDenuncia, setShowDenuncia] = useState(false);

    const usuarioId = id || userLogado?.sub; 
    const navigate = useNavigate();

    useEffect(() => {
        async function loadPerfil() {
            try {
                const res = await authFetch(`http://localhost:3000/api/usuarios/perfil/${usuarioId}`);
                if (res.ok) {
                    const data = await res.json();
                    setPerfil(data);
                    
                }
            } catch (err) { console.error(err); }
        }
        loadPerfil();
    }, [usuarioId]);

    useEffect(() => {
        async function loadPosts() {
            let url = `http://localhost:3000/api/posts?`;
            
            if (filtro === 'curtidas') {
                url += `liked_by=${usuarioId}`;
            } else {
                url += `user_id=${usuarioId}`;
                if (filtro === 'midia') url += `&only_media=true`;
            }

            try {
                const res = await authFetch(url);
                if (res.ok) setPosts(await res.json());
            } catch (err) { console.error(err); }
        }
        loadPosts();
    }, [usuarioId, filtro]);

    const handleFollow = async () => {
        const url = `http://localhost:3000/api/seguidores/${usuarioId}`;
        const method = seguindo ? "DELETE" : "POST";
        const res = await authFetch(url, { method });
        if(res.ok) {
            setSeguindo(!seguindo);
            setPerfil(prev => ({
                ...prev,
                total_seguidores: seguindo ? prev.total_seguidores - 1 : prev.total_seguidores + 1
            }));
        }
    };

    const abrirLista = async (tipo) => {
        try {
            const res = await authFetch(`http://localhost:3000/api/seguidores/${usuarioId}/${tipo}`);
            if (res.ok) {
                setUsuariosLista(await res.json());
                setTipoLista(tipo === "seguidores" ? "Seguidores" : "Seguindo");
                setShowLista(true);
            }
        } catch (error) {
            console.error("Erro ao carregar lista", error);
        }
    };

    const handleAdminDeleteUser = async () => {
        if (!confirm(`ATENÇÃO: Como Administrador, você está prestes a excluir permanentemente o usuário @${perfil.usuario} e todos os seus dados. Continuar?`)) return;

        try {
            const res = await authFetch(`http://localhost:3000/api/usuarios/admin/${perfil.id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                alert("Usuário banido/excluído com sucesso.");
                navigate("/"); 
            } else {
                alert("Erro ao excluir usuário.");
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (!perfil) return <div className="text-center mt-5">Carregando...</div>;
    const isAdmin = userLogado?.papel === 1;

    const isMeuPerfil = userLogado?.sub == perfil.id;

    return (
        <div className="min-vh-100 pb-5">
            <div className="container mt-4" style={{maxWidth: "600px"}}>
                <div className="card border-0 shadow-sm mb-3">
                    <div style={{height: "150px", backgroundColor: "#cfd9de"}}></div>
                    
                    <div className="px-3 pb-3 position-relative">
                        <img 
                            src={perfil.url_perfil_foto || "https://placehold.co/120"} 
                            className="rounded-circle border border-4 border-body position-absolute"
                            width="120" height="120"
                            style={{top: "-60px", objectFit: 'cover'}}
                        />
                        
                        <div className="d-flex justify-content-end mt-3" style={{height: "40px"}}>
                            {isMeuPerfil ? (
                                <button className="btn btn-outline-body rounded-pill fw-bold border" onClick={() => setShowEdit(true)}>
                                    Editar perfil
                                </button>
                            ) : (
                                <>
                                <button 
                                    className={`btn rounded-pill fw-bold ${seguindo ? 'btn-outline-danger' : 'btn-dark'}`} 
                                    onClick={handleFollow}
                                >
                                    {seguindo ? "Deixar de Seguir" : "Seguir"}
                                </button>

                                <button 
                                        className="btn  rounded-pill fw-bold" 
                                        onClick={() => setShowDenuncia(true)}
                                        title="Denunciar Usuário"
                                    >
                                        ⚠️
                                    </button>

                                {isAdmin && (
                                        <button 
                                            className="btn rounded-pill fw-bold" 
                                            onClick={handleAdminDeleteUser}
                                            title="Banir este usuário"
                                        >
                                            🚫
                                        </button>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="mt-3">
                            <h4 className="fw-bold mb-0">{perfil.nome}</h4>
                            <div className="text-muted">@{perfil.usuario}</div>
                            
                            {perfil.bio && <p className="mt-2 mb-2">{perfil.bio}</p>}
                            
                            <div className="d-flex gap-3 mt-2 text-muted small">
                                <button 
                                    className="btn btn-link text-decoration-none text-muted p-0 border-0" 
                                    onClick={() => abrirLista("seguindo")}
                                >
                                    <strong className="text-body">{perfil.total_seguindo}</strong> Seguindo
                                </button>
                                <button 
                                    className="btn btn-link text-decoration-none text-muted p-0 border-0" 
                                    onClick={() => abrirLista("seguidores")}
                                >
                                    <strong className="text-body">{perfil.total_seguidores}</strong> Seguidores
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <ul className="nav nav-pills nav-fill mb-3 bg-body p-2 rounded shadow-sm">
                    <li className="nav-item">
                        <button className={`nav-link rounded-pill ${filtro === 'todos' ? 'active bg-primary text-white' : 'text-body'}`} onClick={() => setFiltro('todos')}>Posts</button>
                    </li>
                    <li className="nav-item">
                        <button className={`nav-link rounded-pill ${filtro === 'midia' ? 'active bg-primary text-white' : 'text-body'}`} onClick={() => setFiltro('midia')}>Mídia</button>
                    </li>
                    <li className="nav-item">
                        <button className={`nav-link rounded-pill ${filtro === 'curtidas' ? 'active bg-primary text-white' : 'text-body'}`} onClick={() => setFiltro('curtidas')}>Curtidas</button>
                    </li>
                </ul>

                <div>
                    {posts.length === 0 ? (
                        <div className="text-center py-5 text-muted">Nada para ver aqui ainda.</div>
                    ) : (
                        posts.map(p => (
                            <Post 
                                key={p.id} 
                                post={p} 
                                onDelete={(id) => setPosts(posts.filter(x => x.id !== id))} 
                                onUpdate={(updatedPost) => setPosts(posts.map(x => x.id === updatedPost.id ? updatedPost : x))}
                            />
                        ))
                    )}
                </div>
            </div>

            {isMeuPerfil && (
                <EditarPerfilModal 
                    show={showEdit} 
                    handleClose={() => setShowEdit(false)} 
                    perfil={perfil}
                    onUpdate={(novosDados) => setPerfil({...perfil, ...novosDados})}
                />
            )}

            <ListaUsuariosModal 
                show={showLista} 
                handleClose={() => setShowLista(false)} 
                titulo={tipoLista} 
                usuarios={usuariosLista} 
            />

            <DenunciaModal 
                show={showDenuncia} 
                handleClose={() => setShowDenuncia(false)} 
                alvo={{ tipo: 'usuario', id: perfil.id }}
            />
        </div>
    );
};
export default Perfil;