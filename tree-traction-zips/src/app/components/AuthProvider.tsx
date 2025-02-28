"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext<{ isAuthenticated: boolean; login: () => void; logout: () => void } | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const authStatus = localStorage.getItem("isAuthenticated");
        if (!authStatus) {
            router.push("/password"); // Redirect to password page
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    const login = () => {
        localStorage.setItem("isAuthenticated", "true");
        setIsAuthenticated(true);
        router.push("/home");
    };

    const logout = () => {
        localStorage.removeItem("isAuthenticated");
        setIsAuthenticated(false);
        router.push("/password");
    };

    return <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
}
