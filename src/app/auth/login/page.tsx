"use client";
import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { HiMail } from "react-icons/hi";

type LoginFormInputs = {
    email: string;
};

export default function Login() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormInputs>();

    const onSubmit = async (data: LoginFormInputs) => {
        try {
            const response = await axios.post("/api/auth/login", data);
            if (response.data.success) {
                toast.success(response.data.message);
                if (response.data.verified) {
                    router.push("/");
                } else {
                    router.push("/auth/checkemail?type=login");
                }
            } else {
                toast.error(response.data.message);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="w-full max-w-md z-10">
                <div className="text-center mb-10 animate-in fade-in slide-in-from-top duration-700">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-3">
                        <span className="text-gradient">Welcome Back</span>
                    </h1>
                    <p className="text-muted-foreground">Enter your email to access your workspace</p>
                </div>

                <div className="glass-card p-8 rounded-3xl shadow-2xl animate-in zoom-in duration-500">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground ml-1 flex items-center gap-2">
                                <HiMail className="text-primary text-lg" />
                                Email Address
                            </label>
                            <div className="relative group">
                                <input
                                    placeholder="name@example.com"
                                    className="w-full bg-black/40 border border-border rounded-2xl px-4 py-3.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-300"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address"
                                        }
                                    })}
                                />
                                <div className="absolute inset-0 rounded-2xl border border-primary/0 group-focus-within:border-primary/50 pointer-events-none transition-colors duration-300"></div>
                            </div>
                            {errors.email?.message && (
                                <p className="text-destructive text-xs ml-1 font-medium animate-in fade-in slide-in-from-left-2 transition-all">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3 mt-4 overflow-hidden relative group"
                        >
                            <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    <span>Please Wait...</span>
                                </>
                            ) : (
                                "Sign In with Email"
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-border text-center">
                        <p className="text-sm text-muted-foreground italic">
                            A verification link will be sent to your inbox.
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center text-xs text-muted-foreground/60 animate-in fade-in duration-1000">
                    <p>© 2026 TaskManager. Premium Productivity Workspace.</p>
                </div>
            </div>
        </div>
    );
}
