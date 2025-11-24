// src/components/FeedFiltravel.jsx
import { useState } from "react";
const Lista = ({ posts, termoAutor, termoConteudo }) => {
    const filtro = posts.filter(post =>
        post.autor.toLowerCase().includes(termoAutor.toLowerCase()) && post.texto.toLowerCase().includes(termoConteudo.toLowerCase())
    );
    return filtro.map(post => <div key={post.id}>{post.autor}: {post.texto}</div>);
}

const FeedFiltravel = () => {
    const [termoAutor, setTermoAutor] = useState("");
    const [termoConteudo, setTermoConteudo] = useState("");
    const posts = [
        { id: 1, autor: "Ana", texto: "JSX ❤️" },
        { id: 2, autor: "Leo", texto: "Hooks são poderosos" },
        { id: 3, autor: "Ester", texto: "React é muito bom!" },
        { id: 4, autor: "Lucas", texto: "Testando o filtro de hooks." },
    ];
    return (
        <>
            <input placeholder="Filtrar por autor..." value={termoAutor} onChange={e => setTermoAutor(e.target.value)}/>
            <input placeholder="Filtrar por conteúdo..." value={termoConteudo} onChange={e => setTermoConteudo(e.target.value)}/>
            <Lista posts={posts} termoAutor={termoAutor} termoConteudo={termoConteudo} />
        </>
    )
}
export default FeedFiltravel