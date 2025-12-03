import { useState, useEffect } from "react";
import { useAuthFetch } from "../../hooks/useAuthFetch";
import Post from "./Post";
import NovoPost from "./NovoPost";
import SugestoesSeguir from "../usuarios/SugestoesSeguir";

const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [feedType, setFeedType] = useState("foryou");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const authFetch = useAuthFetch();

    const fetchPosts = async (pagina, tipo, reset = false) => {
        if (loading) return;
        setLoading(true);
        
        try {
            if (reset) setPosts([]);

            let url = `http://localhost:3000/api/posts?page=${pagina}&limit=10`;
            if (tipo === 'following') {
                url += `&feed_type=following`;
            }

            const res = await authFetch(url);
            if (res.ok) {
                const novosPosts = await res.json();
                
                if (novosPosts.length < 10) setHasMore(false); 
                else setHasMore(true);

                setPosts(prev => reset ? novosPosts : [...prev, ...novosPosts]);
            }
        } catch (error) {
            console.error("Erro ao carregar posts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPage(1);
        setHasMore(true);
        fetchPosts(1, feedType, true);
    }, [feedType]);

    const carregarMais = () => {
        const proximaPagina = page + 1;
        setPage(proximaPagina);
        fetchPosts(proximaPagina, feedType, false);
    };

    const handlePostCreated = () => {
        setFeedType("foryou"); 
        fetchPosts(1, "foryou", true);
    };

    const handleUpdatePost = (postAtualizado) => {
        setPosts(prevPosts => prevPosts.map(p => 
            p.id === postAtualizado.id ? postAtualizado : p
        ));
    };

    const removePostDaLista = (id) => {
        setPosts(posts.filter(p => p.id !== id));
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-lg-7 col-md-8 mx-auto position-relative">
                    
                    <div className="d-flex justify-content-center gap-3 mb-3 bg-body sticky-top py-2" style={{top: "56px", zIndex: 10}}>
                        <button 
                            className={`btn btn-sm rounded-pill px-4 fw-bold ${feedType === 'foryou' ? 'btn-dark' : 'btn-outline-secondary'}`}
                            onClick={() => setFeedType("foryou")}
                        >
                            Para você
                        </button>
                        <button 
                            className={`btn btn-sm rounded-pill px-4 fw-bold ${feedType === 'following' ? 'btn-dark' : 'btn-outline-secondary'}`}
                            onClick={() => setFeedType("following")}
                        >
                            Seguindo
                        </button>
                    </div>

                    <NovoPost onPostCreated={handlePostCreated} />
                    
                    {posts.map(post => (
                        <Post key={post.id} post={post} onDelete={removePostDaLista} onUpdate={handleUpdatePost}/>
                    ))}

                    <div className="text-center py-4">
                        {loading && <div className="spinner-border text-primary" role="status"></div>}
                        
                        {!loading && hasMore && posts.length > 0 && (
                            <button className="btn btn-outline-primary rounded-pill" onClick={carregarMais}>
                                Carregar mais posts
                            </button>
                        )}

                        {!loading && !hasMore && posts.length > 0 && (
                            <p className="text-muted">Você chegou ao fim! 🏁</p>
                        )}

                        {!loading && posts.length === 0 && (
                            <div className="text-muted py-5">
                                {feedType === 'following' 
                                    ? "Você ainda não segue ninguém ou eles não postaram nada." 
                                    : "Nenhum post encontrado."}
                            </div>
                        )}
                    </div>
                </div>

                <button 
                        className="btn btn-primary rounded-circle shadow-lg d-flex align-items-center justify-content-center"
                        onClick={scrollToTop}
                        style={{
                            position: 'fixed',
                            bottom: '30px',
                            right: '30px',
                            width: '60px',
                            height: '60px',
                            zIndex: 1000,
                            fontSize: '24px'
                        }}
                        title="Novo Post"
                    >
                        +
                    </button>

                <div className="col-lg-4 col-md-4 d-none d-md-block">
                    <div className="sticky-top" style={{top: "80px"}}>
                        <SugestoesSeguir />
                        <div className="mt-3 text-muted small px-3">
                            <p>© 2025 wYZe Social.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Feed;