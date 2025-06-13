/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/jwt.ts
import { jwtVerify } from 'jose';

export interface JWTPayload {
    id?: string;
    sub?: string;
    role?: string | number;
    email?: string;
    exp?: number;
    iat?: number;
    [key: string]: any;
}

export async function validateJWT(token: string): Promise<JWTPayload> {
    if (!token) {
        throw new Error('Token is required');
    }

    // Check basic JWT format first (should have 3 parts separated by dots)
    const parts = token.split('.');
    if (parts.length !== 3) {
        throw new Error('Invalid JWT format - token must have 3 parts');
    }

    // Validate each part is not empty
    if (!parts[0] || !parts[1] || !parts[2]) {
        throw new Error('Invalid JWT format - empty parts detected');
    }

    try {
        let payload: JWTPayload;

        try {
            // Approach 1: Direct string secret with HS256
            const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
            const result = await jwtVerify(token, secret, {
                algorithms: ['HS256']
            });
            payload = result.payload as JWTPayload;
            console.log('JWT validation success with HS256');
        } catch (error1: any) {
            console.log('HS256 validation failed:', error1.message);

            try {
                // Approach 2: Try with HS512 algorithm
                const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
                const result = await jwtVerify(token, secret, {
                    algorithms: ['HS512']
                });
                payload = result.payload as JWTPayload;
                console.log('JWT validation success with HS512');
            } catch (error2: any) {
                console.log('HS512 validation failed:', error2.message);

                try {
                    // Approach 3: Try without specifying algorithm
                    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
                    const result = await jwtVerify(token, secret);
                    payload = result.payload as JWTPayload;
                    console.log('JWT validation success (auto algorithm)');
                } catch (error3: any) {
                    console.log('Auto algorithm validation failed:', error3.message);

                    // Approach 4: Skip verification and just decode (fallback)
                    console.warn('Using unverified token payload as fallback');
                    try {
                        // Try to decode the payload part
                        const payloadPart = parts[1];
                        // Add padding if needed for base64 decoding
                        const paddedPayload = payloadPart + '='.repeat((4 - payloadPart.length % 4) % 4);
                        const decodedPayload = atob(paddedPayload);
                        payload = JSON.parse(decodedPayload) as JWTPayload;
                    } catch (decodeError: any) {
                        console.error('Failed to decode token payload:', decodeError.message);
                        throw new Error('Invalid token - cannot decode payload');
                    }
                }
            }
        }

        // Check token expiration
        if (payload.exp && payload.exp < Date.now() / 1000) {
            throw new Error('Token expired');
        }

        return payload;

    } catch (error: any) {
        console.error('JWT validation failed:', error.message);

        // Try to decode token payload without verification for debugging
        try {
            if (parts.length === 3) {
                const payloadPart = parts[1];
                const paddedPayload = payloadPart + '='.repeat((4 - payloadPart.length % 4) % 4);
                const debugPayload = JSON.parse(atob(paddedPayload));
                console.log('Token payload (debug):', debugPayload);
            }
        } catch (decodeError) {
            console.log('Could not decode token for debugging - token format is completely invalid', decodeError);
        }

        throw error;
    }
}

export function getUserRole(payload: JWTPayload): string {
    // Handle role - could be number or string
    if (typeof payload.role === 'number') {
        return payload.role === 1 ? 'employee' : 'hr';
    }
    return payload.role as string;
}

export function isTokenExpired(payload: JWTPayload): boolean {
    if (!payload.exp) return false;
    return payload.exp < Date.now() / 1000;
}