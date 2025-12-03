import { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const processToken = (token) => {
        try {
            const decoded = jwtDecode(token);
            if (decoded.exp && decoded.exp * 1000 < Date.now()) {
                console.warn("Token expirado.");
                return null;
            }
            return decoded;
        } catch (error) {
            console.error("Token inválido:", error);
            return null;
        }
    };

    useEffect(() => {
        const token = sessionStorage.getItem("at");
        if (token) {
            const userData = processToken(token);
            if (userData) {
                setUser(userData);
            } else {
                sessionStorage.removeItem("at");
                setUser(null);
            }
        }
        setLoading(false);
    }, []);

    const login = (accessToken) => {
        sessionStorage.setItem("at", accessToken);
        const userData = processToken(accessToken);
        setUser(userData);
    };

    const logout = () => {
        sessionStorage.removeItem("at");
        setUser(null); 
    };

    const updateUser = (novosDados) => {
        setUser((prev) => ({
            ...prev,
            ...novosDados
        }));
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);