import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

const UsuariosFormRegister = ({ setToastInfo }) => {
    const [nome, setNome] = useState("");
    const [usuario, setUsuario] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [arquivo, setArquivo] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("nome", nome);
        formData.append("usuario", usuario);
        formData.append("email", email);
        formData.append("senha", senha);
        
        if (arquivo) {
            formData.append("foto_perfil", arquivo); 
        }
        try {
            const res = await fetch("http://localhost:3000/api/usuarios/register", {
                method: "POST",
                credentials: "include",
                body: formData,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.erro || "Erro no registro");

            sessionStorage.setItem("at", data.access_token);
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
            <h3 className="text-center mb-3">Criar Conta</h3>
            <div className="mb-3">
                <label>Foto de Perfil</label>
                <input 
                    type="file" 
                    className="form-control" 
                    accept="image/*"
                    onChange={e => setArquivo(e.target.files[0])} 
                />
            </div>
            <div className="mb-3">
                <label>Nome</label>
                <input type="text" className="form-control" value={nome} onChange={e => setNome(e.target.value)} required />
            </div>
            <div className="mb-3">
                <label>Usuário (@)</label>
                <input type="text" className="form-control" value={usuario} onChange={e => setUsuario(e.target.value)} required />
            </div>
            <div className="mb-3">
                <label>Email</label>
                <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="mb-3">
                <label>Senha</label>
                <input type="password" className="form-control" value={senha} onChange={e => setSenha(e.target.value)} required />
            </div>
            
            <button type="submit" className="btn btn-success w-100">Registrar</button>
        </form>
    );
};
export default UsuariosFormRegister;