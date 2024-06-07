import { SignJWT, jwtVerify } from "jose";

const mutate_secret_key = (plain_secret_key: string) => {
    const result = new TextEncoder().encode(plain_secret_key);
    return result
}

export const gen_jwt_token = async (payload: any, secret_key: string, expires_in_mins: number) => {
    const encoded_secret_key = mutate_secret_key(secret_key)
    const issuedAt = Math.floor(Date.now() / 1000)
    const expirationTime = Math.floor((Date.now() + expires_in_mins * 60000) / 1000);
    const jwt = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime(expirationTime)
        .setIssuedAt(issuedAt)
        .sign(encoded_secret_key);
    return jwt;
}

export const verify_jwt_token = async (token: string, secret_key: string): Promise<any> => {
    const encoded_secret_key = mutate_secret_key(secret_key)
    try {
        const { payload } = await jwtVerify(token, encoded_secret_key);
        return payload;
    } catch (err) {
        console.log(err)
        throw new Error('Invalid token');
    }
};