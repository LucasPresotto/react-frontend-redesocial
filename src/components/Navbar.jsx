import { Link, useNavigate } from "react-router-dom";
import { useState } from "react"
import { Offcanvas, Button, Modal } from "react-bootstrap";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useAuthFetch } from "../hooks/useAuthFetch";
import SearchBar from "./SearchBar";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../hooks/AuthContext";
import logo from "../assets/logo.png";
import { SlHome } from "react-icons/sl";
import { IoMdMenu } from "react-icons/io";
import { FaRegUser } from "react-icons/fa6";
import { RiDeleteBin6Line } from "react-icons/ri";

const Navbar = () => {
    const authFetch = useAuthFetch();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();

    const [showMenu, setShowMenu] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleLogout = async () => {
        try {
            await authFetch("http://localhost:3000/api/usuarios/logout", { method: "POST" });
            logout();
            navigate("/usuarios/login");
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            const res = await authFetch("http://localhost:3000/api/usuarios/me", { method: "DELETE" });
            if (res.ok) {
                sessionStorage.removeItem("at");
                alert("Conta excluída com sucesso.");
                navigate("/usuarios/login");
            } else {
                alert("Erro ao excluir conta.");
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (!user) return null;

    return (
        <>
            <nav className={`navbar navbar-expand-lg border-bottom sticky-top ${theme === 'dark' ? 'navbar-dark bg-dark' : 'navbar-light bg-body'}`} style={{ zIndex: 1050 }}>
                <div className="container-fluid px-3">
                    
                    <div className="d-flex align-items-center gap-3" style={{ flex: 1 }}>
                        <button className="btn btn-link text-decoration-none fs-4 p-0 text-reset" onClick={() => setShowMenu(true)}>
                            <IoMdMenu size={28} /> 
                        </button>

                        <Link className="navbar-brand m-0 d-flex align-items-center" to="/">
                            <img src={logo} alt="wYZe" height="33" /> 
                        </Link>

                        
                    </div>

                    <div className="position-absolute start-50 translate-middle-x d-none d-sm-block">
                        <Link 
                            to={`/perfil/${user.sub}`} 
                            className="text-decoration-none fw-bold text-body"
                            title="Ir para meu perfil"
                        >
                            👋 Olá, {user.nome?.split(" ")[0]}
                        </Link>
                    </div>

                        <div className="d-none d-md-block" style={{ maxWidth: "300px", width: "100%" }}>
                            <SearchBar />
                        </div>
                </div>
            </nav>

            <Offcanvas show={showMenu} onHide={() => setShowMenu(false)} placement="start" style={{ zIndex: 1050 }}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title className="fw-bold text-primary">Menu</Offcanvas.Title>
                    <div className="d-flex justify-content-end" style={{ flex: 1 }}>
                        <div className="d-flex align-items-center justify-content-between px-1">
                            <span className="fw-bold text-secondary"></span>
                            <button 
                                className="btn rounded-circle d-flex align-items-center justify-content-center border-2" 
                                onClick={toggleTheme}
                                style={{ width: "45px", height: "45px" }} 
                                title={theme === 'light' ? 'Ativar Modo Escuro' : 'Ativar Modo Claro'}
                            >
                                <span style={{ fontSize: "1.2rem" }}>
                                    {theme === 'light' ? '🌙' : '☀️'}
                                </span>
                            </button>
                        </div>
                    </div>
                </Offcanvas.Header>
                <Offcanvas.Body className="d-flex flex-column gap-2">
                    
                    <Link to="/" className="btn btn-outline-secondary text-start border-0" onClick={() => setShowMenu(false)}>
                        <SlHome   className="me-2" /> Home
                    </Link>
                    
                    <Link to={`/perfil/${user.sub}`} className="btn btn-outline-secondary text-start border-0" onClick={() => setShowMenu(false)}>
                        <FaRegUser  className="me-2"/> Perfil
                    </Link>

                    <div className="mb-3">
                        <SearchBar />
                    </div>

                    {user?.papel === 1 && (
                        <Link to="/admin/denuncias" className="btn btn-outline-secondary text-start border-0 mb-2" onClick={() => setShowMenu(false)}>
                            🚨 Painel de Denúncias
                        </Link>
                    )}

                    <hr />
                    <div className="mt-auto d-flex flex-column gap-2">
                        

                        <button className="btn btn-dark" onClick={handleLogout}>
                            Sair da Conta
                        </button>

                        <button className="btn btn-danger mt-3" onClick={() => { setShowMenu(false); setShowDeleteConfirm(true); }}>
                            <RiDeleteBin6Line className="me-2"/> Excluir Conta
                        </button>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>

            <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Excluir Conta</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Tem certeza que deseja excluir sua conta permanentemente?</p>
                    <p className="text-danger small"><strong>Atenção:</strong> Todos os seus posts, comentários e curtidas serão apagados para sempre.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>Cancelar</Button>
                    <Button variant="danger" onClick={handleDeleteAccount}>Sim, Excluir</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};
export default Navbar;