// src/app/login/layout.tsx
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

// Login layout - cek jika sudah login, redirect ke home
export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Jika sudah ada token, redirect ke home
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (token) {
    redirect("/");
  }

  return <div>{children}</div>;
}
