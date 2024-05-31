import mongoose from "mongoose";
import { nanoid } from "nanoid";

const CredentialSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        password: {
            type: String,
            required: true,
        },
        verification_token: {
            type: String
        },
        is_verified: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true
    }
)

export type Credential = mongoose.InferSchemaType<typeof CredentialSchema>;
export const Credential = mongoose.model("Credential", CredentialSchema)