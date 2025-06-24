"use client";
import { createContext, useContext, useState, Dispatch, SetStateAction } from "react";

type LoaderContextType = {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
};

const LoaderContext = createContext<LoaderContextType>({
  show: false,
  setShow: () => {}, // Tidak perlu parameter yang tidak dipakai
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