import { z } from "zod"

export const bio_validator = z.string().min(15, { message: "Bio must contain atleast 15 character" }).max(300, { message: "Bio cannot exceeds 300 character" })