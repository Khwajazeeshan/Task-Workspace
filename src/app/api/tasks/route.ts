import connectDB from "@/src/config/dbConfig";
import Task from "@/src/models/task";
import User from "@/src/models/user";
import { VerifyToken } from "@/src/utils/VerifyToken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const userId = VerifyToken(request);
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
        }

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: "User not found", success: false }, { status: 404 });
        }

        const { title, description } = await request.json();
        if (!title) {
            return NextResponse.json({ message: "Title is required", success: false }, { status: 400 });
        }

        const newTask = await Task.create({
            userId: user._id,
            userEmail: user.email,
            title,
            description,
        });

        return NextResponse.json({ message: "Task created successfully", success: true, data: newTask }, { status: 201 });
    } catch (error: any) {
        const status = error.message === "Token not found" || error.message === "jwt expired" ? 401 : 500;
        return NextResponse.json({ message: error.message, success: false }, { status });
    }
}

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const userId = VerifyToken(request);
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
        }

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: "User not found", success: false }, { status: 404 });
        }

        // Fetching by user email as requested, though userId is more robust
        const tasks = await Task.find({ userEmail: user.email }).sort({ createdAt: -1 });

        return NextResponse.json({ message: "Tasks fetched successfully", success: true, data: tasks }, { status: 200 });
    } catch (error: any) {
        const status = error.message === "Token not found" || error.message === "jwt expired" ? 401 : 500;
        return NextResponse.json({ message: error.message, success: false }, { status });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        await connectDB();
        const userId = VerifyToken(request);
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
        }

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: "User not found", success: false }, { status: 404 });
        }

        await Task.deleteMany({ userEmail: user.email });

        return NextResponse.json({ message: "All tasks deleted successfully", success: true }, { status: 200 });
    } catch (error: any) {
        const status = error.message === "Token not found" || error.message === "jwt expired" ? 401 : 500;
        return NextResponse.json({ message: error.message, success: false }, { status });
    }
}
