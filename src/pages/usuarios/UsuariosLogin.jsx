import { Link, Navigate } from "react-router-dom";
import UsuariosFormLogin from "../../components/UsuariosFormLogin";
import { useCurrentUser } from "../../hooks/useCurrentUser";

const UsuariosLogin = () => {
    const currentUser = useCurrentUser();
    if (currentUser()) return <Navigate to="/" replace />;

    return (
        <div className="container mt-5">
            <UsuariosFormLogin />
            <div className="text-center mt-3">
                <p>Não tem conta? <Link to="/usuarios/register">Registre-se</Link></p>
            </div>
        </div>
    );
};
export default UsuariosLogin;