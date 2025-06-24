"use client";
import { useLoader } from "@/contexts/LoaderContext";

export default function GlobalLoader() {
  const { show } = useLoader();
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-20 pointer-events-none">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}