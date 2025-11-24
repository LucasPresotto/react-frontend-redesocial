import { Link, useNavigate } from "react-router-dom";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useAuthFetch } from "../hooks/useAuthFetch";

const Navbar = () => {
    const getUser = useCurrentUser();
    const user = getUser();
    const authFetch = useAuthFetch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await authFetch("http://localhost:3000/api/usuarios/logout", { method: "POST" });
            sessionStorage.removeItem("at");
            navigate("/usuarios/login");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
            <div className="container">
                <Link className="navbar-brand" to="/">wYZe Social</Link>
                <div className="d-flex align-items-center">
                    {user ? (
                        <>
                            <span className="text-white me-3">Olá, <strong>{user.nome}</strong></span>
                            <button className="btn btn-sm btn-light" onClick={handleLogout}>Sair</button>
                        </>
                    ) : (
                        <Link to="/usuarios/login" className="btn btn-sm btn-light">Entrar</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};
export default Navbar;