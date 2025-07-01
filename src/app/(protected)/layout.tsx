import LayoutWrapper from "@/components/LayoutWrapper";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import {
  GlobalCallPopup,
  SocketProvider,

} from "@/contexts/SocketContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
  } catch (err) {
    console.error("Invalid token:", err);
    // Token tidak valid atau expired
    redirect("/login");

  }

  return (
    <SocketProvider>
      <LayoutWrapper>
        <GlobalCallPopup />
        {children}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={true}
          rtl={false}
          pauseOnFocusLoss={true}
          draggable={true}
          pauseOnHover={true}
          theme="colored"
        />
      </LayoutWrapper>
    </SocketProvider>
  );
}