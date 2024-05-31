import nodemailer from "nodemailer"

export const transport = nodemailer.createTransport({
    host: Bun.env.MAILTRAP_HOST,
    port: Bun.env.MAILTRAP_PORT,
    auth: {
        user: Bun.env.MAILTRAP_USER,
        pass: Bun.env.MAILTRAP_PASSWORD
    }
});

export const NODE_ENV = Bun.env.NODE_ENV