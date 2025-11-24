import { Link, Navigate } from "react-router-dom";
import UsuariosFormRegister from "../../components/UsuariosFormRegister";
import { useCurrentUser } from "../../hooks/useCurrentUser";

const UsuariosRegister = () => {
    const currentUser = useCurrentUser();
    if (currentUser()) return <Navigate to="/" replace />;

    return (
        <div className="container mt-5">
            <UsuariosFormRegister />
            <div className="text-center mt-3">
                <Link to="/usuarios/login">Voltar para Login</Link>
            </div>
        </div>
    );
};
export default UsuariosRegister;