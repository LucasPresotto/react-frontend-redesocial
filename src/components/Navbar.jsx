import { Link, useNavigate } from "react-router-dom";
import { useState } from "react"
import { Offcanvas, Button, Modal } from "react-bootstrap";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useAuthFetch } from "../hooks/useAuthFetch";
import SearchBar from "./SearchBar";
import { useTheme } from "../contexts/ThemeContext";

const Navbar = () => {
    const getUser = useCurrentUser();
    const user = getUser();
    const authFetch = useAuthFetch();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    const [showMenu, setShowMenu] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleLogout = async () => {
        try {
            await authFetch("http://localhost:3000/api/usuarios/logout", { method: "POST" });
            sessionStorage.removeItem("at");
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
            <nav className={`navbar navbar-expand-lg border-bottom sticky-top ${theme === 'dark' ? 'navbar-dark bg-dark' : 'navbar-light bg-white'}`}>
                <div className="container-fluid px-3">
                    
                    {/* LADO ESQUERDO: Menu + Logo + Busca */}
                    <div className="d-flex align-items-center gap-3" style={{ flex: 1 }}>
                        {/* Botão do Menu (Hambúrguer) */}
                        <button className="btn btn-link text-decoration-none fs-4 p-0 text-reset" onClick={() => setShowMenu(true)}>
                            ☰
                        </button>

                        {/* Nome da Rede */}
                        <Link className="navbar-brand fw-bold text-primary m-0" to="/">wYZe</Link>

                        
                    </div>

                    {/* CENTRO: Olá Usuário */}
                    <div className="position-absolute start-50 translate-middle-x fw-bold d-none d-sm-block">
                        👋 Olá, {user.nome?.split(" ")[0]}
                    </div>

                    {/* Barra de Pesquisa (Visível em telas médias/grandes) */}
                        <div className="d-none d-md-block" style={{ maxWidth: "300px", width: "100%" }}>
                            <SearchBar />
                        </div>
                </div>
            </nav>

            {/* --- MENU LATERAL (OFFCANVAS) --- */}
            <Offcanvas show={showMenu} onHide={() => setShowMenu(false)} placement="start">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title className="fw-bold text-primary">Menu</Offcanvas.Title>
                    {/* Alternar Tema */}
                    <div className="d-flex justify-content-end" style={{ flex: 1 }}>
                        <div className="d-flex align-items-center justify-content-between px-1">
                            <span className="fw-bold text-secondary"></span>
                            <button 
                                className="btn rounded-circle d-flex align-items-center justify-content-center border-2" 
                                onClick={toggleTheme}
                                style={{ width: "45px", height: "45px" }} // Tamanho fixo para garantir que seja um círculo
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
                    
                    {/* Navegação */}
                    <Link to="/" className="btn btn-outline-secondary text-start border-0" onClick={() => setShowMenu(false)}>
                        🏠 Home
                    </Link>
                    
                    <Link to={`/perfil/${user.sub}`} className="btn btn-outline-secondary text-start border-0" onClick={() => setShowMenu(false)}>
                        👤 Perfil
                    </Link>
                    {user?.papel === 1 && (
                        <Link to="/admin/denuncias" className="btn btn-outline-secondary text-start border-0 mb-2" onClick={() => setShowMenu(false)}>
                            🚨 Painel de Denúncias
                        </Link>
                    )}

                    <hr />

                    {/* Ações da Conta */}
                    <div className="mt-auto d-flex flex-column gap-2">
                        

                        {/* Logout */}
                        <button className="btn btn-dark" onClick={handleLogout}>
                            Sair da Conta
                        </button>

                        {/* Excluir Conta */}
                        <button className="btn btn-danger mt-3" onClick={() => { setShowMenu(false); setShowDeleteConfirm(true); }}>
                            🗑️ Excluir Conta
                        </button>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>

            {/* Modal de Confirmação de Exclusão */}
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