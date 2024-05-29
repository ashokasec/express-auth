import { Credential } from "@/models/credentials.model";

export const if_user_exists = async (req: any, res: any, next: any) => {
    const { email } = req.body;
    try {
        let existing_email = await Credential.findOne({ email });
        if (existing_email) return res.status(409).json({ error: "Email already in use." })
        next()
    } catch (error: any) {
        console.error(`Middleware:Error in [Checking for Existing User] : ${error.message}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}