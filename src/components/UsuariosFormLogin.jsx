import { useState } from "react";
import { useNavigate } from "react-router-dom";

const UsuariosFormLogin = () => {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const res = await fetch("http://localhost:3000/api/usuarios/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, senha }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.erro || "Erro no login");

            sessionStorage.setItem("at", data.access_token);
            navigate("/"); // Vai para o Feed
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="card p-4" style={{ maxWidth: "400px", margin: "0 auto" }}>
            <h3 className="text-center mb-3">Login</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="mb-3">
                <label>Email</label>
                <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="mb-3">
                <label>Senha</label>
                <input type="password" className="form-control" value={senha} onChange={e => setSenha(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary w-100">Entrar</button>
        </form>
    );
};
export default UsuariosFormLogin;