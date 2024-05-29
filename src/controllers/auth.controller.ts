import { Credential } from "@/models/credentials.model";

export const sign_up = async (req: any, res: any) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password || name === null || email === null || password === null || name === "" || email === "" || password === "") return res.status(400).json({ error: "Please Provide Required Fields to Proceed" })

    try {
        const new_user = new Credential({ name, email, password })
        const db_result = await new_user.save()
        return res.status(200).json({ message: "User Registered Successfully" });
    } catch (error: any) {
        console.error(`Controller:Error in [Registering New User] : ${error.message}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
export const sign_in = async (req: any, res: any) => {
    const { email, password } = req.body;

    if (!email || !password || email === null || password === null || email === "" || password === "") return res.status(400).json({ error: "Please Provide Required Fields to Proceed" })

    try {
        const existing_user = await Credential.findOne({ email, password })
        if (!existing_user) return res.status(403).json({ message: "Invalid Email / Password" })
        return res.status(200).json({ message: "User Signed In Successfully", user: existing_user });
    } catch (error: any) {
        console.error(`Controller:Error in [Registering New User] : ${error.message}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}