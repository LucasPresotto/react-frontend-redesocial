import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import UsuariosFormLogin from "../../components/usuarios/UsuariosFormLogin";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import Toast from "../../components/Toast";

const UsuariosLogin = () => {
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
            <UsuariosFormLogin setToastInfo={setToastInfo}/>
            <div className="text-center mt-3">
                <p>Não tem conta? <Link to="/usuarios/register">Registre-se</Link></p>
            </div>
        </div>
    );
};
export default UsuariosLogin;