import { useState, useEffect } from "react";
import { useAuthFetch } from "../hooks/useAuthFetch";
import Post from "./Post";
import NovoPost from "./NovoPost";

const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const authFetch = useAuthFetch();

    const carregarPosts = async () => {
        try {
            const res = await authFetch("http://localhost:3000/api/posts");
            if (res.ok) {
                const data = await res.json();
                setPosts(data);
            }
        } catch (error) {
            console.error("Erro ao carregar posts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarPosts();
    }, []);

    const removePostDaLista = (id) => {
        setPosts(posts.filter(p => p.id !== id));
    };

    if (loading) return <div className="text-center mt-5">Carregando...</div>;

    return (
        <div className="container" style={{ maxWidth: "600px" }}>
            <NovoPost onPostCreated={carregarPosts} />
            {posts.map(post => (
                <Post key={post.id} post={post} onDelete={removePostDaLista} />
            ))}
        </div>
    );
};
export default Feed;