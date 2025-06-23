// src/app/login/layout.tsx
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";


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
    try {
      // Ganti dengan secret yang sama dengan backend Anda
      jwt.verify(token, process.env.JWT_SECRET!);
      // Jika token valid, redirect ke home
      redirect("/");
    } catch (err) {
      // Jika token tidak valid/expired, biarkan tetap di halaman login
    }
  }

  return <div>{children}</div>;
}
