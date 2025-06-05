"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Loader from "./Loader";

const RouteLoader = () => {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    // Simulasi delay biar kelihatan (optional)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname]);

  return loading ? <Loader /> : null;
};

export default RouteLoader;
