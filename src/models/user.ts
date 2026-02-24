import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {

    email: string;
    isVerified: boolean;
    verifyToken: string | null;
    verifyTokenExpiry: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
    {

        email: {
            type: String,
            required: [true, "Please provide an email"],
            unique: true,
        },

        isVerified: {
            type: Boolean,
            default: false,
        },

        verifyToken: String,
        verifyTokenExpiry: Date,
    },
    {
        timestamps: true,
    }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
