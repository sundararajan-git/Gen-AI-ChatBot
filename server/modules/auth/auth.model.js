import { Schema, model } from "mongoose"

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['employee', 'admin'], default: 'employee' }
}, { timestamps: true })

export const User = model("User", UserSchema)