import { z } from "zod"

export const name_validator = z.string().nonempty({ message: "Name must contain atleast 1 character" })

export const email_validator = z.string().email().nonempty({ message: "Email Cannot be Empty" })

export const password_validator = z
    .string()
    .superRefine((value, context) => {
        if (value.length < 8) {
            context.addIssue({
                code: z.ZodIssueCode.too_small,
                minimum: 8,
                type: "string",
                inclusive: true,
                message: "Password must be at least 8 characters long",
            });
        } else if (value.length > 25) {
            context.addIssue({
                code: z.ZodIssueCode.too_big,
                maximum: 25,
                type: "string",
                inclusive: true,
                message: "Password must not exceed 25 characters",
            });
        } else {
            if (!/[0-9]/.test(value)) {
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Password must include at least one number",
                });
            }
            if (!/[a-z]/.test(value)) {
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Password must include at least one lowercase letter",
                });
            }
            if (!/[A-Z]/.test(value)) {
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Password must include at least one uppercase letter",
                });
            }
            if (!/[\W_]/.test(value)) {
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Password must include at least one special character",
                });
            }
        }
    });

export const token_validator = z.string().nonempty('No token provided').regex(/\.+/);