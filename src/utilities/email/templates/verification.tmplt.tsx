import { project } from "@/config"

export const onboarding_email_template = (name: string, verification_link: string) => {
    const text_content = `Hello ${name},\n\nWelcome to our platform! We're excited to have you join our community.\nTo get started, please verify your email address by clicking the link below:\n${verification_link}\n\nIf you did not sign up for this account, you can ignore this email.\n\nBest regards,\n ${project.name}`;
    const html_content = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Our Platform - Verify Your Email</title>
        <style>
            body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f7f7f7;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border: 1px solid #dddddd;
        }
        .header {
            text-align: center;
            padding: 10px 0;
        }
        .content {
            margin: 20px 0;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            color: #ffffff;
            background-color: #007BFF;
            text-decoration: none;
            border-radius: 5px;
        }
        .footer {
            margin-top: 20px;
            text-align: center;
            color: #888888;
            font-size: 12px;
        }
        </style>
    </head>
    <body>
        <p>Hello ${name},</p>
        <p>Welcome to our platform! We're excited to have you join our community.</p>
        <p>To get started, please verify your email address by clicking the link below:</p>
        <p><a href="${verification_link}" title="Click here to verify your email address" style="text-decoration: none; color: #007BFF;">Verify Email Address</a></p>
        <p>If you did not sign up for this account, you can ignore this email.</p>
        <p>Best regards,<br>${project.name}</p>
    </body>
    </html>
    `
    return { text_content, html_content };
}