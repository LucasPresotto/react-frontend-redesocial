import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Feed from './components/posts/Feed.jsx';
import UsuariosLogin from './pages/usuarios/UsuariosLogin.jsx';
import UsuariosRegister from './pages/usuarios/UsuariosRegister.jsx';
import Navbar from './components/Navbar.jsx';
import { useCurrentUser } from './hooks/useCurrentUser.jsx';
import Perfil from './pages/usuarios/Perfil.jsx';
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import PainelDenuncias from './pages/PainelDenuncias.jsx';
import PaginaPost from './pages/PaginaPost.jsx';
import { AuthProvider, useAuth } from "./hooks/AuthContext.jsx";

const ProtectedLayout = () => {
    const { user } = useAuth();
    if (!user) {
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
            { path: "/perfil/:id", element: <Perfil /> },
            { path: "/meu-perfil", element: <Perfil /> }, 
            { path: "/admin/denuncias", element: <PainelDenuncias /> },
            { path: "/posts/:id", element: <PaginaPost /> },
        ]
    }
]);

createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <ThemeProvider>
                <RouterProvider router={router} />
        </ThemeProvider>
    </AuthProvider>
)