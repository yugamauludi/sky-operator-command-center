"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type User = { username: string } | null;

const UserContext = createContext<{
    user: User;
    setUser: (user: User) => void;
}>({
    user: null,
    setUser: () => { },
});

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User>(null);

    // Ambil username dari localStorage saat pertama kali mount
    useEffect(() => {
        const username = localStorage.getItem("username");
        if (username) {
            setUser({ username });
        }
    }, []);

    // Setiap user berubah, simpan ke localStorage
    useEffect(() => {
        if (user?.username) {
            localStorage.setItem("username", user.username);
        } else {
            localStorage.removeItem("username");
        }
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}