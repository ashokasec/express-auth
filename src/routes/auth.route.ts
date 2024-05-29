import { sign_in, sign_up } from "@/controllers/auth.controller"
import { if_user_exists } from "@/middlewares/if_user_exists"
import express from "express"
const route = express.Router()

route.post("/signup", if_user_exists, sign_up)
route.post("/signin", sign_in)

export default route