import { Credential } from "@/models/credentials.model";
import { z } from "zod";

// Validators Imports
import { name_validator, email_validator, password_validator, token_validator } from "@/validations/auth.valid";
import { send_welcome_email } from "@/utilities/email/email.integration";
import { nanoid } from "nanoid";
import { gen_jwt_token, verify_jwt_token } from "@/utilities/jwt.handler";
import { jwt_secrets } from "@/config";

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
    token: token_validator,
    email: email_validator,
    password: password_validator,
    new_password: password_validator,
})

// Auth Controllers
export const sign_up = async (req: any, res: any) => {

    // Check if user already exists based on a flag in the request object
    if (req.user_exists === true) return res.status(403).json({ error: "User Already Exists" })

    const { name, email, password } = req.body;

    // Validate the Input
    const validation = sign_up_validation.safeParse({ name, email, password });
    if (!validation.success) {
        const errors = validation.error.errors.map(err => err.message);
        return res.status(400).json({ errors });
    }

    try {
        // Create a new user document with provided details
        const new_user = new Credential({ name, email, password })
        const created_new_user = await new_user.save()

        // Generate a unique verification token (gibberish), create payload for JWT token containing user email and token, and update user's verification_token field with the generated token
        const gibberish = nanoid(20)
        const payload = { email: created_new_user.email, token: gibberish }
        created_new_user.verification_token = gibberish
        await created_new_user.save()

        const token = await gen_jwt_token(payload, jwt_secrets.email_verification.secret, jwt_secrets.email_verification.expiry)

        // commenting mailing as it consuming time in testing the functionalities
        await send_welcome_email(new_user.email, new_user.name, token)

        return res.status(200).json({ message: "User Registered Successfully" });
    } catch (error: any) {
        console.error(`Controller:Auth:Error in [Registering New User] : ${error.message}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export const sign_in = async (req: any, res: any) => {
    const { email, password } = req.body;

    // Validate the Input
    const validation = sign_in_validation.safeParse({ email, password });
    if (!validation.success) {
        const errors = validation.error.errors.map(err => err.message);
        return res.status(400).json({ errors });
    }

    try {
        // Check if the user with the provided email exists
        const existing_user = await Credential.findOne({ email, password })

        // If user does not exist, return error response
        if (!existing_user) return res.status(403).json({ message: "Invalid Email / Password" })
        return res.status(200).json({ message: "User Signed In Successfully", user: existing_user });
    } catch (error: any) {
        console.error(`Controller:Auth:Error in [Login a User] : ${error.message}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export const send_password_reset_link = async (req: any, res: any) => {
    const password_verification_jwt_token_expires_in_mins = parseFloat(Bun.env.PASSWORD_VERIFICATION_JWT_TOKEN_EXPIRES_IN_MINS ?? "")

    const { email } = req.body;

    // Validate the input
    const validation = email_validator.safeParse(email);
    if (!validation.success) {
        const errors = validation.error.errors.map(err => err.message);
        return res.status(400).json({ errors });
    }

    try {
        // Check if the user with the provided email exists
        const existing_user = await Credential.findOne({ email });

        // If user does not exist, return error response
        if (!existing_user) {
            return res.status(403).json({ message: "Invalid Email" });
        }

        // Generate a unique token for password reset, create payload for JWT token containing user email and token, and update user's forgot_pass_token field with the generated token
        const gibberish = nanoid(20);
        const payload = { email: existing_user.email, token: gibberish };
        existing_user.forgot_pass_token = gibberish;
        await existing_user.save();


        // Generate JWT token with the payload for password reset
        const token = await gen_jwt_token(payload, jwt_secrets.forgot_pass.secret, jwt_secrets.forgot_pass.expiry);
        console.log("Actual JWT Token:", token);

        // Return success response with password reset token
        return res.status(200).json({ message: "Password Reset Successfully", reset_link: token });
    } catch (error: any) {
        console.error(`Controller:Auth:Error in [Forgotting User Password] : ${error.message}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export const validate_reset_token = async (req: any, res: any) => {
    const { token } = req.query;

    // Validate the input
    const reset_token_validation = token_validator;
    const validation = reset_token_validation.safeParse(token);
    if (!validation.success) {
        return res.status(400).json({ error: "Invalid Token" });
    }

    try {
        // Verify the reset token
        const reset_token = await verify_jwt_token(token, jwt_secrets.forgot_pass.secret)

        // Find the existing user with the provided email from reset token
        let existing_email = await Credential.findOne({ email: reset_token.email })
        if (!existing_email) return res.status(403).json({ error: "Invalid User Request" })

        // If the token matches the forgot_pass_token, mark user as verified
        if (existing_email.forgot_pass_token === reset_token.token) {
            await Credential.updateOne({ email: existing_email.email }, { $set: { is_verified: true } });
            return res.status(200).json({ success: "Reset Password Token is Valid" })
        }

        // Otherwise, return invalid token error
        return res.status(403).json({ error: "Invalid Token" })
    } catch (error: any) {
        console.error(`Controller:Verfication:Error in [Validating Verification Token] : ${error.message}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export const forgot_password = async (req: any, res: any) => {
    const { token } = req.query;
    const { email, password, new_password } = req.body;

    // Validate the input
    const validation = forgot_password_validation.safeParse({ token, email, password, new_password });
    if (!validation.success) {
        const errors = validation.error.errors.map(err => err.message);
        return res.status(400).json({ errors });
    }

    try {
        // Verify the reset token
        const reset_token = await verify_jwt_token(token, jwt_secrets.forgot_pass.secret)

        // Check if the email from the request body matches the email from the reset token
        if (email !== reset_token.email) {
            return res.status(403).json({ error: "Invalid User Request" });
        }

        // Find the existing user with the provided email and password
        const existing_user = await Credential.findOne({ email: reset_token.email, password });
        if (!existing_user) return res.status(403).json({ message: "Invalid Email / Password" });

        // Save the Password
        existing_user.password = new_password
        await existing_user.save()

        return res.status(200).json({ message: "Password Reset Successfully" });
    } catch (error: any) {
        console.error(`Controller:Auth:Error in [Forgotting User Password] : ${error.message}`);
        return res.status(403).json({ error: "Invalid User Request" });
    }
}