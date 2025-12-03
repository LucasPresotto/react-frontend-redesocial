import { Link, Navigate } from "react-router-dom";
import { useState } from "react";
import UsuariosFormRegister from "../../components/usuarios/UsuariosFormRegister";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import Toast from "../../components/Toast";

const UsuariosRegister = () => {
    const currentUser = useCurrentUser();
    const [toastInfo, setToastInfo] = useState(null);
    if (currentUser()) return <Navigate to="/" replace />;

    return (
        <div className="container mt-5">
            {toastInfo && (
                <Toast 
                    message={toastInfo.msg} 
                    type={toastInfo.type} 
                    onClose={() => setToastInfo(null)} 
                />
            )}
            <UsuariosFormRegister setToastInfo={setToastInfo} />
            <div className="text-center mt-3">
                <Link to="/usuarios/login">Voltar para Login</Link>
            </div>
        </div>
    );
};
export default UsuariosRegister;