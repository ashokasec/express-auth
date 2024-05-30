import nodemailer from "nodemailer"

export const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "7c9d9ace073d5b",
        pass: "ce916a689f358a"
    }
});

export const NODE_ENV = Bun.env.NODE_ENV