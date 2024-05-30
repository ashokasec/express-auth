import { forgot_password, sign_in, sign_up } from "@/controllers/auth.controller"
import { if_user_exists } from "@/middlewares/if_user_exists"
import express from "express"
const route = express.Router()

// 1. Registering a User
route.post("/signup", if_user_exists, sign_up)

// 2. Signing In a User
route.post("/signin", sign_in)

// 3. Reseting Password
route.patch("/forgot-password", forgot_password)

export default route