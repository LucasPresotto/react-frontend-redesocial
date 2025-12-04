import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthFetch } from "../../hooks/useAuthFetch";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const SugestoesSeguir = () => {
    const [usuarios, setUsuarios] = useState([]);
    const authFetch = useAuthFetch();

    useEffect(() => {
        authFetch(`${API_BASE_URL}/api/usuarios/sugestoes`)
            .then(res => res.ok ? res.json() : [])
            .then(data => setUsuarios(data))
            .catch(console.error);
    }, []);

    if (usuarios.length === 0) return null;

    return (
        <div className="card border-0 shadow-sm bg-body">
            <div className="card-body">
                <h5 className="fw-bold mb-3">Quem seguir</h5>
                <div className="d-flex flex-column gap-3">
                    {usuarios.map(u => (
                        <div key={u.id} className="d-flex align-items-center justify-content-between">
                            <Link to={`/perfil/${u.id}`} className="d-flex align-items-center gap-2 text-decoration-none text-body">
                                <img src={u.url_perfil_foto || "https://placehold.co/40"} className="rounded-circle" width="40" height="40" style={{objectFit: 'cover'}} />
                                <div style={{lineHeight: '1.2'}}>
                                    <div className="fw-bold small">{u.nome}</div>
                                    <div className="text-muted small">@{u.usuario}</div>
                                </div>
                            </Link>
                            <Link to={`/perfil/${u.id}`} className="btn btn-sm btn-dark rounded-pill fw-bold">Ver</Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default SugestoesSeguir;