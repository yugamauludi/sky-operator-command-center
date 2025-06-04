// src/app/login/layout.tsx
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

// Login layout - cek jika sudah login, redirect ke home
export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Debug: cek apakah layout dipanggil
  console.log('🔍 Login Layout called');
  
  // Jika sudah ada token, redirect ke home
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  console.log('🔑 Token in login layout:', !!token);
  console.log('🔑 Token value:', token);

  if (token) {
    console.log('✅ Token found, redirecting to home');
    redirect('/')
  }

  console.log('➡️ No token, showing login page');

  return (
    <div>
      {children}
    </div>
  );
}