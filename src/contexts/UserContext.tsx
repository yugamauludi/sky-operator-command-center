"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

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
    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}