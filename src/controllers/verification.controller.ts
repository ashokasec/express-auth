// Validation Schema

import { jwt_secrets } from "@/config";
import { Credential } from "@/models/credentials.model";
import { verify_jwt_token } from "@/utilities/jwt.handler";
import { z } from "zod";



export const validate_verification_token = async (req: any, res: any) => {
    const { token } = req.query

    const jwt_token_validation = z.string().nonempty('No token provided').regex(/\.+/);

    const validation = jwt_token_validation.safeParse(token);

    if (!validation.success) {
        return res.status(400).json({ error: "Invalid Token" });
    }

    try {
        const verify_token = await verify_jwt_token(token, jwt_secrets.email_verification.secret)
        console.log(verify_token)

        let existing_email = await Credential.findOne({ email: verify_token.email })
        if (!existing_email) return res.status(403).json({ error: "Invalid User Request" })
        if (existing_email.verification_token === verify_token.token) {
            await Credential.updateOne({ email: existing_email.email }, { $set: { is_verified: true } });
            return res.status(200).json({ success: "Email Verified" })
        }
        return res.status(403).json({ error: "Invalid Token" })
    } catch (error: any) {
        console.error(`Controller:Verfication:Error in [Validating Verification Token] : ${error.message}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}