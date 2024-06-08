import {
    forgot_password,
    send_password_reset_link,
    sign_in,
    sign_up,
    validate_reset_token
} from "@/controllers/auth.controller"
import { validate_verification_token } from "@/controllers/verification.controller"
import { if_user_exists } from "@/middlewares/if_user_exists"
import express from "express"
const route = express.Router()

// 1. Registering a User
route.post("/signup", if_user_exists, sign_up)

// 2. Signing In a User
route.post("/signin", sign_in)

// 3. Reseting Password
route.patch("/forgot-password", forgot_password)
route.post("/send-reset-link", send_password_reset_link)
route.get("/validate-token", validate_reset_token)

// 4. Verifying User
route.get("/verify", validate_verification_token)

export default route