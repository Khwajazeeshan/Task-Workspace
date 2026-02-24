import nodemailer from "nodemailer";
import User from "@/src/models/user"
import crypto from "crypto";

interface SendEmailParams {
    email: string;
    emailType: "VERIFY" | "RESET";
    userId: string;
}

export const sendEmail = async ({ email, emailType, userId }: SendEmailParams) => {
    try {
        const hashedToken = crypto.randomBytes(32).toString("hex");

        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, {
                verifyToken: hashedToken,
                verifyTokenExpiry: new Date(Date.now() + 3600000) // 1 hour
            })
        } 

        const transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.GMAIL,
                pass: process.env.PASSWORD,
            },
        });

        const subject = emailType === "VERIFY" ? "Verify your email - Task Workspace" : "Reset Your Password - Task Workspace";
        const actionText = emailType === "VERIFY" ? "verify your email" : "reset your password";
        const path = emailType === "VERIFY" ? "/auth/verifyemail" : "/auth/newpassword";

        const domain = process.env.DOMAIN?.endsWith("/")
            ? process.env.DOMAIN.slice(0, -1)
            : process.env.DOMAIN;

        const mailOption = {
            from: `"Task Workspace" <${process.env.GMAIL}>`,
            to: email,
            subject: subject,
            html: `
                <div style="font-family: sans-serif; background-color: #f9f9f9; padding: 20px;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <div style="background-color: #000000; color: #ffffff; padding: 30px; text-align: center;">
                            <h1 style="margin: 0; font-size: 24px;">Task Workspace</h1>
                        </div>
                        <div style="padding: 40px; color: #333333;">
                            <h2 style="margin-bottom: 20px; font-size: 20px;">Protect Your Account</h2>
                            <p style="margin-bottom: 30px; line-height: 1.6;">Hello,</p>
                            <p style="margin-bottom: 30px; line-height: 1.6;">Please click the button below to ${actionText}. This link will expire in 1 hour.</p>
                            <div style="text-align: center; margin-bottom: 40px;">
                                <a href="${domain}${path}?token=${hashedToken}" 
                                style="background-color: #000000; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                                    ${emailType === "VERIFY" ? "Verify Email" : "Reset Password"}
                                </a>
                            </div>
                            <p style="font-size: 14px; color: #777777;">If you did not request this email, you can safely ignore it.</p>
                        </div>
                        <div style="background-color: #f1f1f1; padding: 20px; text-align: center; font-size: 12px; color: #999999;">
                            &copy; ${new Date().getFullYear()} Task Workspace. All rights reserved.
                        </div>
                    </div>
                </div>
            `
        }

        const mailResponse = await transport.sendMail(mailOption)
        return mailResponse
    } catch (error: any) {
        throw new Error(error.message)
    }
}