import { Credential } from "@/models/credentials.model";
import { z } from "zod";

const email_validation = z.object({
    email: z.string().email().nonempty(),
})

export const if_user_exists = async (req: any, res: any, next: any) => {
    const { email } = req.body;

    const validation = email_validation.safeParse({ email })

    if (!validation.success) {
        const errors = validation.error.errors.map(err => err.message);
        return res.status(400).json({ errors });
    }

    try {
        let existing_email = await Credential.findOne({ email });
        if (existing_email) return res.status(409).json({ error: "Email already in use." })
        next()
    } catch (error: any) {
        console.error(`Middleware:Error in [Checking for Existing User] : ${error.message}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}