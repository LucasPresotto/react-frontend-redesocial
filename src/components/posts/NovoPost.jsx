import { useState } from "react";
import { useAuthFetch } from "../../hooks/useAuthFetch";
import Toast from "../../components/Toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const NovoPost = ({ onPostCreated }) => {
    const [texto, setTexto] = useState("");
    const [arquivo, setArquivo] = useState(null);
    const [toastInfo, setToastInfo] = useState(null);
    const authFetch = useAuthFetch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!texto.trim() && !arquivo) return;

        const formData = new FormData();
        formData.append("conteudo", texto);
        let tipo = 0; 
        if (arquivo) {
            if (arquivo.type.startsWith('image/')) {
                tipo = 1; 
            } else if (arquivo.type.startsWith('video/')) {
                tipo = 2;
            } else {
                alert("Formato de arquivo não suportado.");
                return;
            }
        } 
        formData.append("tipo", tipo);

        if (arquivo) formData.append("arquivo", arquivo);

        try {
            const res = await authFetch(`${API_BASE_URL}/api/posts`, {
                method: "POST",
                body: formData, 
            });
            if (res.ok) {
                setTexto("");
                setArquivo(null);
                e.target.reset();
                if (onPostCreated) onPostCreated(); 
                setToastInfo({ msg: "Post criado com sucesso!", type: "success" });
            } else {
                const data = await res.json().catch(() => ({}));
                setToastInfo({ msg: data.erro || "Erro ao publicar", type: "danger" });
            }
        } catch (error) {
            console.error(error);
            setToastInfo({ msg: "Erro de comunicação com o servidor.", type: "danger" });
        }
    };

    return (
        <div className="card mb-4 p-3">
            {toastInfo && (
                <Toast 
                    message={toastInfo.msg} 
                    type={toastInfo.type} 
                    onClose={() => setToastInfo(null)} 
                />
            )}
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
                        accept="image/*,video/*" 
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