import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        credential_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Credential"
        },
        profile_picture: {
            type: String
        },
        bio: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

export type User = mongoose.InferSchemaType<typeof UserSchema>;
export const User = mongoose.model("User", UserSchema)