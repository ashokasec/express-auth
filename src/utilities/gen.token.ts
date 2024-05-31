import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.VERIFICATION_JWT_SECRET!;
const secret_key = new TextEncoder().encode(JWT_SECRET);

export const gen_jwt_token = async (payload: any, expires_in_mins: number) => {
    const expirationTime = Math.floor((Date.now() + expires_in_mins * 60000) / 1000);
    const jwt = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime(expirationTime)
        .sign(secret_key);

    return jwt;
}

export const verifyToken = async (token: string): Promise<any> => {
    try {
        const { payload } = await jwtVerify(token, secret_key);
        return payload;
    } catch (err) {
        throw new Error('Invalid token');
    }
};