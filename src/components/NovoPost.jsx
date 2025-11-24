import { useState } from "react";
import { useAuthFetch } from "../hooks/useAuthFetch";

const NovoPost = ({ onPostCreated }) => {
    const [texto, setTexto] = useState("");
    const [arquivo, setArquivo] = useState(null);
    const authFetch = useAuthFetch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!texto.trim() && !arquivo) return;

        const formData = new FormData();
        formData.append("conteudo", texto);
        // Lógica simples: se tem arquivo, é tipo 1 (imagem), senão tipo 0 (texto)
        // (Seu backend exige tipo 1 ou 2 para uploads. Vamos assumir 1 para simplificar ou 0 texto)
        const tipo = arquivo ? 1 : 0; 
        formData.append("tipo", tipo);
        if (arquivo) formData.append("arquivo", arquivo);

        try {
            const res = await authFetch("http://localhost:3000/api/posts", {
                method: "POST",
                body: formData, // fetch detecta FormData e ajusta headers
            });
            if (res.ok) {
                setTexto("");
                setArquivo(null);
                if (onPostCreated) onPostCreated(); // Recarrega o feed
            } else {
                alert("Erro ao publicar");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="card mb-4 p-3">
            <form onSubmit={handleSubmit}>
                <textarea 
                    className="form-control mb-2" 
                    rows="3" 
                    placeholder="No que você está pensando?" 
                    value={texto} 
                    onChange={e => setTexto(e.target.value)} 
                />
                <input 
                    type="file" 
                    className="form-control mb-2" 
                    accept="image/*"
                    onChange={e => setArquivo(e.target.files[0])}
                />
                <div className="text-end">
                    <button type="submit" className="btn btn-primary">Publicar</button>
                </div>
            </form>
        </div>
    );
};
export default NovoPost;