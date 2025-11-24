import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Feed from './components/Feed.jsx';
import UsuariosLogin from './pages/usuarios/UsuariosLogin.jsx';
import UsuariosRegister from './pages/usuarios/UsuariosRegister.jsx';
import Navbar from './components/Navbar.jsx';
import { useCurrentUser } from './hooks/useCurrentUser.jsx';

// Layout para rotas protegidas (com Navbar)
const ProtectedLayout = () => {
    const getUser = useCurrentUser();
    if (!getUser()) {
        return <Navigate to="/usuarios/login" replace />;
    }
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    );
};

const router = createBrowserRouter([
    // Rotas Públicas
    { path: "/usuarios/login", element: <UsuariosLogin /> },
    { path: "/usuarios/register", element: <UsuariosRegister /> },

    // Rotas Protegidas
    {
        path: "/",
        element: <ProtectedLayout />,
        children: [
            { path: "/", element: <Feed /> },
            // Você pode adicionar rotas de perfil, sobre, etc. aqui
        ]
    }
]);

createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
)