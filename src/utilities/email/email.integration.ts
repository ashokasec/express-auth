import { project, transport } from "@/config";
import { onboarding_email_template } from "./templates/verification.tmplt";

export const send_welcome_email = async (to_email: string, name: string, token: string) => {
    try {
        const verification_link = `http://localhost:${Bun.env.PORT}/auth/verify?token=${token}`
        const { text_content, html_content } = onboarding_email_template(name, verification_link)
        const result = await transport.sendMail({
            from: `"${project.name}" <your@email.com>`,
            to: to_email,
            subject: 'Welcome to Our Platform!',
            text: text_content,
            html: html_content
        });
        console.log("Welcome email sent: %s", result.messageId);
    } catch (error: any) {
        console.error(`Controller:Auth:Error in [Registering New User] : ${error.message}`);
    }
}