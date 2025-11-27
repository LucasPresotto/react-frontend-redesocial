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
        let tipo = 0; // Texto puro
        if (arquivo) {
            if (arquivo.type.startsWith('image/')) {
                tipo = 1; // Imagem
            } else if (arquivo.type.startsWith('video/')) {
                tipo = 2; // Vídeo
            } else {
                alert("Formato de arquivo não suportado.");
                return;
            }
        } 
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
                e.target.reset();
                if (onPostCreated) onPostCreated(); // Recarrega o feed
            } else {
                alert("Erro ao publicar");
            }
        } catch (error) {
            console.error(error);
            alert("Erro na comunicação com o servidor.");
        }
    };

    return (
        <div className="card mb-4 p-3">
            <form onSubmit={handleSubmit}>
                <textarea 
                    className="form-control mb-2 border-0 bg-body" 
                    rows="3" 
                    placeholder="No que você está pensando?" 
                    value={texto} 
                    onChange={e => setTexto(e.target.value)} 
                    style={{resize: "none"}}
                />
                <div className="d-flex justify-content-between align-items-center">
                    <input 
                        type="file" 
                        className="form-control form-control-sm w-50" 
                        accept="image/*,video/*" // <--- PERMITE VÍDEOS AGORA
                        onChange={e => setArquivo(e.target.files[0])}
                    />
                    <button type="submit" className="btn btn-primary rounded-pill px-4 fw-bold">
                        Postar
                    </button>
                </div>
            </form>
        </div>
    );
};
export default NovoPost;