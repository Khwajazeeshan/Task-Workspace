import connectDB from "@/src/config/dbConfig";
import User from "@/src/models/user";
import { NextRequest, NextResponse } from "next/server";
import { GenerateToken } from "@/src/utils/GenerateToken";
import { sendEmail } from "@/src/services/mailer";

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const { email } = await request.json();

        const user = await User.findOne({ email });

        // 1️⃣ If user not exist → create + send verify email
        if (!user) {
            const newUser = await User.create({ email });

            await sendEmail({
                email,
                emailType: "VERIFY",
                userId: newUser._id.toString(),
            });

            return NextResponse.json(
                { message: "Verify your email to continue", success: true },
                { status: 201 }
            );
        }

        // 2️⃣ If exist but not verified
        if (!user.isVerified) {
            await sendEmail({
                email,
                emailType: "VERIFY",
                userId: user._id.toString(),
            });

            return NextResponse.json(
                { message: "Please check your inbox and verify your email first", success: false },
                { status: 403 }
            );
        }

        // 3️⃣ If verified → login
        const { accessToken, refreshToken } = GenerateToken(user._id);

        const response = NextResponse.json(
            { message: "Login successful", success: true, verified: true },
            { status: 200 }
        );

        response.cookies.set("Accesstoken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 30,
        });

        response.cookies.set("RefreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 3,
        });

        return response;
    } catch (error) {
        return NextResponse.json(
            { message: "Internal server error", success: false },
            { status: 500 }
        );
    }
}