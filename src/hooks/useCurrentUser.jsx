import { jwtDecode } from "jwt-decode";

export const useCurrentUser = () => {
    return () => {
        const token = sessionStorage.getItem("at");
        if (!token) return null;
        try {
            return jwtDecode(token);
        } catch (err) {
            console.error("Token inválido:", err);
            return null;
        }
    };
};  