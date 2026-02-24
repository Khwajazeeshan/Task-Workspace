import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITask extends Document {
    userEmail: string;
    userId: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const taskSchema: Schema<ITask> = new mongoose.Schema(
    {
        userEmail: {
            type: String,
            required: [true, "Please provide a user email"],
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Please provide a user id"],
        },
        title: {
            type: String,
            required: [true, "Please provide a task title"],
        },
        description: {
            type: String,
        },
        completed: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Task: Model<ITask> = mongoose.models.Task || mongoose.model<ITask>("Task", taskSchema);

export default Task;
