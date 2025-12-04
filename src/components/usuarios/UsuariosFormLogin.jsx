import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useAuth } from "../../hooks/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const UsuariosFormLogin = ({ setToastInfo }) => {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE_URL}/api/usuarios/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, senha }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.erro || "Erro no login");

            login(data.access_token);

            navigate("/");
        } catch (err) {
            setToastInfo({ msg: err.message, type: "danger" });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="card p-4" style={{ maxWidth: "400px", margin: "0 auto" }}>
            <div className="text-center mb-4">
                <img src={logo} alt="wYZe" height="60" />
            </div>
            <h3 className="text-center mb-3">Login</h3>
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