"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { HiMailOpen, HiOutlineArrowNarrowLeft } from "react-icons/hi";

function CheckEmailContent() {
    const searchParams = useSearchParams();
    const type = searchParams.get("type");

    return (
        <div className="glass-card p-10 rounded-3xl backdrop-blur-xl shadow-2xl text-center border border-border/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
                <HiMailOpen className="text-9xl" />
            </div>

            <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-primary/5">
                <HiMailOpen className="w-12 h-12 text-primary" />
            </div>

            <h1 className="text-3xl font-black mb-4 tracking-tight">Check Your Inbox</h1>
            <p className="text-muted-foreground mb-10 font-medium leading-relaxed max-w-sm mx-auto">
                We've sent a <span className="text-primary">{type === "signup" ? "verification" : "login"}</span> link to your email.
                Please click the link to activate your workspace.
            </p>

            <div className="space-y-4">
                <Link
                    href="https://gmail.com"
                    target="_blank"
                    className="block w-full py-4 bg-primary text-white font-bold rounded-2xl hover:bg-blue-600 transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
                >
                    Open Gmail
                </Link>

                <Link
                    href="/auth/login"
                    className="flex items-center justify-center gap-2 w-full py-4 bg-secondary/50 border border-border text-foreground font-bold rounded-2xl hover:bg-secondary transition-all"
                >
                    <HiOutlineArrowNarrowLeft className="text-lg" />
                    Back to Login
                </Link>
            </div>

            <p className="mt-10 text-xs text-muted-foreground font-medium uppercase tracking-widest opacity-60">
                Check your spam folder if you can't find it.
            </p>
        </div>
    );
}

export default function CheckEmail() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative">
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="w-full max-w-md animate-in fade-in zoom-in duration-500 z-10">
                <Suspense fallback={
                    <div className="glass-card p-12 rounded-3xl text-center">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                        <h1 className="text-xl font-bold opacity-50">Loading Portal...</h1>
                    </div>
                }>
                    <CheckEmailContent />
                </Suspense>
            </div>
        </div>
    );
}
