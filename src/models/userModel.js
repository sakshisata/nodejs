import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, 'username is required'],
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
            minlength: [3, "username must not less then 3 character"],
            maxlength: [20, "username must not more then 20 character"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "password must not less then 3 character"],
            maxlength: [20, "password must not more then 20 character"],
        },
        refreshToken: {
            type: String,
        },
    },
    {
        timestamps: true
    }
)

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const User = mongoose.model("User", userSchema);