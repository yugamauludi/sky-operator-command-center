// import { cookies } from 'next/headers';
// import jwt from 'jsonwebtoken';
// import { User } from '@/types/auth';

// const JWT_SECRET = process.env.JWT_SECRET;

// export interface JWTPayload {
//     userId: string;
//     email: string;
//     iat?: number;
//     exp?: number;
// }

// export function verifyToken(token: string): JWTPayload | null {
//     try {
//         return jwt.verify(token, JWT_SECRET) as JWTPayload;
//     } catch {
//         return null;
//     }
// }

// export function generateToken(payload: { userId: string; email: string }): string {
//     return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
// }

// export async function getServerSession(): Promise<User | null> {
//     const cookieStore = cookies();
//     const token = cookieStore.get('auth-token')?.value;

//     if (!token) return null;

//     const payload = verifyToken(token);
//     if (!payload) return null;

//     // Di sini kamu bisa fetch user data dari database
//     // Untuk contoh, kita return data dari token
//     return {
//         id: payload.userId,
//         email: payload.email,
//         name: 'User Name' // Fetch dari database
//     };
// }
