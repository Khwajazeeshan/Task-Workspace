import connectDB from "@/src/config/dbConfig";
import User from "@/src/models/user";
import { VerifyToken } from "@/src/utils/VerifyToken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const userId = VerifyToken(request);
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
        }

        const user = await User.findById(userId).select("-verifyToken -verifyTokenExpiry");
        if (!user) {
            return NextResponse.json({ message: "User not found", success: false }, { status: 404 });
        }

        return NextResponse.json({
            message: "User fetched successfully",
            success: true,
            data: user
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ message: error.message, success: false }, { status: 401 });
    }
}
