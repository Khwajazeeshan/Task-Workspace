import connectDB from "@/src/config/dbConfig";
import Task from "@/src/models/task";
import { VerifyToken } from "@/src/utils/VerifyToken";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id: taskId } = await params;
        const userId = VerifyToken(request);
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
        }

        const { title, description, completed } = await request.json();

        const updatedTask = await Task.findOneAndUpdate(
            { _id: taskId, userId },
            { title, description, completed },
            { new: true }
        );

        if (!updatedTask) {
            return NextResponse.json({ message: "Task not found or unauthorized", success: false }, { status: 404 });
        }

        return NextResponse.json({ message: "Task updated successfully", success: true, data: updatedTask }, { status: 200 });
    } catch (error: any) {
        const status = error.message === "Token not found" || error.message === "jwt expired" ? 401 : 500;
        return NextResponse.json({ message: error.message, success: false }, { status });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id: taskId } = await params;
        const userId = VerifyToken(request);
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
        }

        const deletedTask = await Task.findOneAndDelete({ _id: taskId, userId });

        if (!deletedTask) {
            return NextResponse.json({ message: "Task not found or unauthorized", success: false }, { status: 404 });
        }

        return NextResponse.json({ message: "Task deleted successfully", success: true }, { status: 200 });
    } catch (error: any) {
        const status = error.message === "Token not found" || error.message === "jwt expired" ? 401 : 500;
        return NextResponse.json({ message: error.message, success: false }, { status });
    }
}
