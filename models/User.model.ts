import mongoose from "mongoose";
import jwt from "jsonwebtoken";
export interface UserDocument extends mongoose.Document {
    email: string;
    name: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    role: string[];
    generateAuthToken(): Promise<string>;
}

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: [String],
        enum: ["admin", "user"],
        default: "user",
    }
}, { timestamps: true });

userSchema.methods.generateAuthToken = function () {
    return jwt.sign(
        {
            id: this._id,
        },
        process.env.ACCESS_TOKEN_SECRET as string,
        {
            expiresIn: "10d",
        }
    );
};
export const UserModel = mongoose.model<UserDocument>("User", userSchema);
