import mongoose from "mongoose";

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
        // verification_token: {
        //     type: String,
        //     required: true,
        // },
        // verification_token_expiry: {
        //     type: Date,
        //     required: true,
        // },
        is_verified: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true
    }
)

CredentialSchema.methods.markAsVerified = function () {
    this.isVerified = true;
    return this.save();
};

export type Credential = mongoose.InferSchemaType<typeof CredentialSchema>;
export const Credential = mongoose.model("Credential", CredentialSchema)