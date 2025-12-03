import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthFetch } from "../hooks/useAuthFetch";
import { CiSearch } from "react-icons/ci";

const SearchBar = () => {
    const [query, setQuery] = useState("");
    const [resultados, setResultados] = useState([]);
    const authFetch = useAuthFetch();

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.length < 2) {
                setResultados([]);
                return;
            }
            try {
                const res = await authFetch(`http://localhost:3000/api/usuarios/search?q=${query}`);
                if (res.ok) setResultados(await res.json());
            } catch (err) { console.error(err); }
        }, 300); 

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    return (
        <div className="position-relative w-100" style={{ maxWidth: "300px" }}>
            <input 
                type="text" 
                className="form-control rounded-pill"
                placeholder="🔍 Buscar usuários..." 
                value={query} 
                onChange={(e) => setQuery(e.target.value)}
            />
            {resultados.length > 0 && (
                <div className="list-group position-absolute w-100 mt-1 shadow" style={{ zIndex: 1000 }}>
                    {resultados.map(u => (
                        <Link key={u.id} to={`/perfil/${u.id}`} className="list-group-item list-group-item-action d-flex align-items-center gap-2" onClick={() => {setQuery(""); setResultados([])}}>
                            <img src={u.url_perfil_foto || "https://placehold.co/40"} className="rounded-circle" width="30" height="30" />
                            <div>
                                <div className="fw-bold">{u.nome}</div>
                                <small className="text-muted">@{u.usuario}</small>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};
export default SearchBar;