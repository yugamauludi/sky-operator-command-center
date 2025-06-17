import LayoutWrapper from "@/components/LayoutWrapper";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  GlobalCallPopup,
  SocketProvider,
  UserNumberSetup,
} from "@/contexts/SocketContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Protected layout - ADA auth check di sini
export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth check
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  return (
    <SocketProvider>
      <LayoutWrapper>
        <GlobalCallPopup />
        <UserNumberSetup />
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
