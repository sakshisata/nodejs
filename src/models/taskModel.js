import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
    {
        task: {
            type: String,
            required: true,
            unique: true
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
    },
    {
        timestamps: true
    }
)

export const Task = mongoose.model("Task", taskSchema);