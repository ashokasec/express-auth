import { transport } from "@/config";

const gen_welcome_email = (to_email: string, name: string) => {
    return {
        from: '"Your Name" <your@email.com>',
        to: to_email,
        subject: 'Welcome to Our Platform!',
        text: `Hello ${name},\n\nWelcome to our platform! We're thrilled to have you on board.`,
        html: `<p>Hello ${name},</p><p>Welcome to our platform! We're thrilled to have you on board.</p>`
    };
}

export const send_welcome_email = async (to_email: string, name: string) => {
    try {
        const welcome_email = gen_welcome_email(to_email, name);
        const result = await transport.sendMail(welcome_email);
        console.log("Welcome email sent: %s", result.messageId);
    } catch (error: any) {
        console.error(`Controller:Auth:Error in [Registering New User] : ${error.message}`);
    }
}