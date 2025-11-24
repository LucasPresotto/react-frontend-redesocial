import { useNavigate } from "react-router-dom";

export const useAuthFetch = () => {
    const navigate = useNavigate();

    return async (url, fetchOptions = {}) => {
        const { signal, headers: originalHeaders, ...restOptions } = fetchOptions;
        const headers = new Headers(originalHeaders || {});
        const accessToken = sessionStorage.getItem("at");

        // Se o body for FormData, NÃO podemos setar Content-Type (o navegador faz isso)
        // Se não for, e não tiver setado, assumimos JSON
        if (!(fetchOptions.body instanceof FormData) && !headers.has("Content-Type")) {
             headers.set("Content-Type", "application/json");
        }

        if (accessToken) {
            headers.set("Authorization", `Bearer ${accessToken}`);
        }

        const baseOptions = { ...restOptions, signal };

        let res = await fetch(url, { ...baseOptions, headers });

        if (res.status !== 401) return res;

        // Tenta renovar o token
        const refreshRes = await fetch("http://localhost:3000/api/usuarios/refresh", {
            method: "POST",
            credentials: "include",
            signal,
        });

        if (!refreshRes.ok) {
            sessionStorage.removeItem("at");
            navigate("/usuarios/login", { replace: true });
            return res;
        }

        const data = await refreshRes.json().catch(() => ({}));
        if (!data?.access_token) {
            sessionStorage.removeItem("at");
            navigate("/usuarios/login", { replace: true });
            return res;
        }

        sessionStorage.setItem("at", data.access_token);
        headers.set("Authorization", `Bearer ${data.access_token}`);

        return await fetch(url, { ...baseOptions, headers });
    };
};