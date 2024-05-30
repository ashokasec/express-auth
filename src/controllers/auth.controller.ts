import { Credential } from "@/models/credentials.model";
import { z } from "zod";

// Validators Imports
import { name_validator, email_validator, password_validator } from "@/validations/auth.valid";
import { send_welcome_email } from "@/utilities/email.integration";


// Validation Schema
const sign_up_validation = z.object({
    name: name_validator,
    email: email_validator,
    password: password_validator,
})

const sign_in_validation = z.object({
    email: email_validator,
    password: password_validator,
})

const forgot_password_validation = z.object({
    email: email_validator,
    password: password_validator,
    new_password: password_validator,
})

// Auth Controllers
export const sign_up = async (req: any, res: any) => {
    const { name, email, password } = req.body;

    const validation = sign_up_validation.safeParse({ name, email, password });

    if (!validation.success) {
        const errors = validation.error.errors.map(err => err.message);
        return res.status(400).json({ errors });
    }

    try {
        const new_user = new Credential({ name, email, password })
        await new_user.save()
        await send_welcome_email(new_user.email, new_user.name)
        return res.status(200).json({ message: "User Registered Successfully" });
    } catch (error: any) {
        console.error(`Controller:Auth:Error in [Registering New User] : ${error.message}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export const sign_in = async (req: any, res: any) => {
    const { email, password } = req.body;

    const validation = sign_in_validation.safeParse({ email, password });

    if (!validation.success) {
        const errors = validation.error.errors.map(err => err.message);
        return res.status(400).json({ errors });
    }

    try {
        const existing_user = await Credential.findOne({ email, password })
        if (!existing_user) return res.status(403).json({ message: "Invalid Email / Password" })
        return res.status(200).json({ message: "User Signed In Successfully", user: existing_user });
    } catch (error: any) {
        console.error(`Controller:Auth:Error in [Login a User] : ${error.message}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export const forgot_password = async (req: any, res: any) => {
    const { email, password, new_password } = req.body;

    const validation = forgot_password_validation.safeParse({ email, password, new_password });

    if (!validation.success) {
        const errors = validation.error.errors.map(err => err.message);
        return res.status(400).json({ errors });
    }

    try {
        const existing_user = await Credential.findOne({ email, password })
        if (!existing_user) return res.status(403).json({ message: "Invalid Email / Password" })
        existing_user.password = new_password
        await existing_user.save()
        return res.status(200).json({ message: "Password Reset Successfully" });
    } catch (error: any) {
        console.error(`Controller:Auth:Error in [Forgotting User Password] : ${error.message}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}