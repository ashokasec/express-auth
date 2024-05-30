import { z } from "zod"

export const name_validator = z.string().nonempty({ message: "Name must contain atleast 1 character" })

export const email_validator = z.string().email().nonempty()

export const password_validator = z.string()
    .min(8, "Password must be at least 8 characters long")
    .max(25, "Password must not exceed 25 characters")
    .refine(value => /[0-9]/.test(value), {
        message: "Password must include at least one number"
    })
    .refine(value => /[a-z]/.test(value), {
        message: "Password must include at least one lowercase letter"
    })
    .refine(value => /[A-Z]/.test(value), {
        message: "Password must include at least one uppercase letter"
    })
    .refine(value => /[\W_]/.test(value), {
        message: "Password must include at least one special character"
    })