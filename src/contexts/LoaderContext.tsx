"use client";
import { createContext, useContext, useState } from "react";

const LoaderContext = createContext({
  show: false,
  setShow: (v: boolean) => {},
});

export function LoaderProvider({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  return (
    <LoaderContext.Provider value={{ show, setShow }}>
      {children}
    </LoaderContext.Provider>
  );
}

export const useLoader = () => useContext(LoaderContext);