import { createContext, useState, useEffect, useContext } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Tenta ler do localStorage ou usa 'light' como padrão
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    useEffect(() => {
        // Aplica o tema na tag <html> do HTML (Bootstrap 5.3 usa data-bs-theme)
        document.documentElement.setAttribute("data-bs-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);