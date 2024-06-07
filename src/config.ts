import nodemailer from "nodemailer"

export const project = {
    name: "Express-Auth"
} 

export const transport = nodemailer.createTransport({
    host: Bun.env.MAILTRAP_HOST,
    port: Bun.env.MAILTRAP_PORT,
    auth: {
        user: Bun.env.MAILTRAP_USER,
        pass: Bun.env.MAILTRAP_PASSWORD
    }
});

export const cookie = {
    ACCESS_TOKEN: "access_token",
    REFRESH_TOKEN: "refresh_token",
    OPTIONS: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Set secure flag in production
        sameSite: 'strict',
    }
}

export const jwt_secrets = {
    email_verification: {
        secret: Bun.env.VERIFICATION_JWT_SECRET || "",
        expiry: Number(Bun.env.VERIFICATION_JWT_EXPIRES_IN_MINS || "")
    },
    forgot_pass: {
        secret: Bun.env.FORGOT_PASSWORD_JWT_SECRET || "",
        expiry: Number(Bun.env.FORGOT_PASSWORD_JWT_EXPIRES_IN_MINS || "")
    },
    access_token: {
        secret: Bun.env.AUTH_ACCESS_JWT_SECRET || "",
        expiry: Number(Bun.env.AUTH_ACCESS_JWT_EXPIRES_IN_MINS || "")
    },
    refresh_token: {
        secret: Bun.env.AUTH_REFRESH_JWT_SECRET || "",
        expiry: Number(Bun.env.AUTH_REFRESH_JWT_EXPIRES_IN_MINS || "")
    },

}
export const NODE_ENV = Bun.env.NODE_ENV