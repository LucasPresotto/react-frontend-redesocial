// src/components/NovoPost.jsx
import { useState } from "react";
const Like = ({ curtidas, onCurtir }) => {
    return <button onClick={onCurtir}>👍 {curtidas}</button>;
}
const NovoPost = () => {
    const [texto, setTexto] = useState("");
    const [curtidas, setCurtidas] = useState(0);
    const publicar = (e) => {
        e.preventDefault();
        if (!texto.trim()) return;
        alert(`Publicado: ${texto}`);
        setTexto("");
    }
    const curtir = (e) => {
        e.preventDefault();
        setCurtidas(curtidas + 1);
    }
    return (
        <form onSubmit={publicar}>
            <textarea value={texto} onChange={e => setTexto(e.target.value)} />
            <div>
                <button type="submit">Publicar</button>
                {/* Passando responsabilidade de alteração de estado de Pai para Filho */}
                <Like curtidas={curtidas} onCurtir={curtir} />
            </div>
            <div>
                <p>{texto}</p>
            </div>
        </form>
    )
}
export default NovoPost