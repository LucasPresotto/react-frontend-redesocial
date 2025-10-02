// src/components/Feed.jsx
import { useState } from 'react'
const Post = ({ autor, texto, curtidas, onCurtir}) => {
    return (
        <article>
            <strong>{autor}</strong>
            <p>{texto}</p>
            <button onClick={onCurtir}>👍 {curtidas}</button>;
        </article>
    )
}
const Feed = () => {
    const [posts, setPosts] = useState([
        { id: 1, autor: "Ana", texto: "Primeiro post!", curtidas: 0 },
        { id: 2, autor: "Leo", texto: "React é top!", curtidas: 0 },
    ]);
    const curtir = (id) => {
        setPosts(posts.map(post => {
            if (post.id === id) {
                return { ...post, curtidas: post.curtidas + 1 };
            }
            return post;
        }));
    }
    const totalCurtidas = posts.reduce((total, post) => total + post.curtidas, 0);

    return (
        <div>
            <h4>Total de Curtidas: {totalCurtidas}</h4>
            {posts.map(post => (
                <Post key={post.id} {...post} onCurtir={() => curtir(post.id)}/>
            ))}
        </div>
    );
}
export default Feed