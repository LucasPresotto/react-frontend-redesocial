import { useState, useEffect } from "react";
import { useAuthFetch } from "../hooks/useAuthFetch";

const PainelDenuncias = () => {
    const [denuncias, setDenuncias] = useState([]);
    const authFetch = useAuthFetch();

    const carregarDenuncias = async () => {
        try {
            const res = await authFetch("http://localhost:3000/api/denuncias");
            if (res.ok) setDenuncias(await res.json());
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        carregarDenuncias();
    }, []);

    const handlePunir = async (d) => {
        if (!confirm("Tem certeza? Isso apagará o conteúdo denunciado.")) return;
        
        let url = "";
        if (d.target_post_id) url = `http://localhost:3000/api/posts/${d.target_post_id}`;
        else if (d.target_comentario_id) url = `http://localhost:3000/api/comentarios/${d.target_comentario_id}`;
        else if (d.target_usuario_id) url = `http://localhost:3000/api/usuarios/admin/${d.target_usuario_id}`;

        try {
            const res = await authFetch(url, { method: "DELETE" });
            if (res.ok) {
                alert("Conteúdo removido com sucesso.");
                setDenuncias(denuncias.filter(x => x.id !== d.id));
            } else {
                alert("Erro ao remover conteúdo (talvez já tenha sido apagado).");
                handleDescartar(d.id);
            }
        } catch (err) { console.error(err); }
    };

    const handleDescartar = async (id) => {
        if (!confirm("Descartar esta denúncia?")) return;
        try {
            await authFetch(`http://localhost:3000/api/denuncias/${id}`, { method: "DELETE" });
            setDenuncias(denuncias.filter(x => x.id !== id));
        } catch (err) { console.error(err); }
    };

    return (
        <div className="min-vh-100 bg-body">
            <div className="container mt-4">
                <h2 className="mb-4 text-danger">🚨 Central de Denúncias</h2>
                
                {denuncias.length === 0 ? (
                    <p className="text-muted">Nenhuma denúncia pendente. Tudo tranquilo!</p>
                ) : (
                    <div className="list-group shadow-sm">
                        {denuncias.map(d => (
                            <div key={d.id} className="list-group-item p-3">
                                <div className="d-flex justify-content-between">
                                    <h5 className="mb-1">
                                        {d.target_post_id && <span className="badge bg-primary me-2">Post</span>}
                                        {d.target_comentario_id && <span className="badge bg-secondary me-2">Comentário</span>}
                                        {d.target_usuario_id && <span className="badge bg-warning text-dark me-2">Perfil</span>}
                                        <small className="text-muted fs-6">Denunciado por: {d.denunciante_nome}</small>
                                    </h5>
                                    <small className="text-muted">{new Date(d.data_criacao).toLocaleString()}</small>
                                </div>
                                
                                <p className="mb-2"><strong>Motivo:</strong> {d.motivo}</p>
                                
                                <div className="bg-body p-2 rounded border mb-3">
                                    {d.target_post_id && (
                                        <div>
                                            <p className="mb-1 fst-italic">"{d.post_conteudo}"</p>
                                            {d.post_midia && <span className="badge bg-body">Possui Mídia</span>}
                                        </div>
                                    )}
                                    {d.target_comentario_id && <p className="mb-0 fst-italic">"{d.comentario_conteudo}"</p>}
                                    {d.target_usuario_id && (
                                        <div>
                                            <p className="mb-0 fw-bold">{d.usuario_alvo_nome} (@{d.usuario_alvo_user})</p>
                                        </div>
                                    )}
                                </div>

                                <div className="d-flex gap-2">
                                    <button className="btn btn-danger btn-sm" onClick={() => handlePunir(d)}>
                                        🗑️ Apagar Conteúdo / Banir
                                    </button>
                                    <button className="btn btn-secondary btn-sm" onClick={() => handleDescartar(d.id)}>
                                        ✅ Ignorar Denúncia
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
export default PainelDenuncias;