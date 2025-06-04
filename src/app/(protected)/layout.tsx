// src/app/(protected)/layout.tsx
import LayoutWrapper from "@/components/LayoutWrapper";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  GlobalCallPopup,
  SocketProvider,
  UserNumberSetup,
} from "@/contexts/SocketContext";

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
      </LayoutWrapper>
    </SocketProvider>
  );
}
