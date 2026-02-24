"use client";
import React, { useEffect, useState, useCallback, Suspense } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { HiCheckCircle, HiXCircle, HiBadgeCheck } from "react-icons/hi";

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [verifying, setVerifying] = useState(true);
    const [verified, setVerified] = useState(false);

    const verifyToken = useCallback(async () => {
        if (!token) {
            setVerifying(false);
            return;
        }
        try {
            const response = await axios.post("/api/auth/verifyemail", { token });
            if (response.data.success) {
                setVerified(true);
                toast.success("Identity verified successfully!");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Verification failed");
        } finally {
            setVerifying(false);
        }
    }, [token]);

    useEffect(() => {
        verifyToken();
    }, [verifyToken]);

    return (
        <div className="glass-card p-10 rounded-3xl backdrop-blur-xl shadow-2xl text-center border border-border/40 relative overflow-hidden">
            <div className="mb-8">
                {verifying ? (
                    <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto shadow-lg"></div>
                ) : verified ? (
                    <div className="w-24 h-24 bg-green-500/10 rounded-3xl flex items-center justify-center mx-auto mb-4 animate-in zoom-in duration-500 shadow-xl shadow-green-500/5">
                        <HiBadgeCheck className="w-14 h-14 text-green-500" />
                    </div>
                ) : (
                    <div className="w-24 h-24 bg-destructive/10 rounded-3xl flex items-center justify-center mx-auto mb-4 animate-in zoom-in duration-500 shadow-xl shadow-destructive/5">
                        <HiXCircle className="w-14 h-14 text-destructive" />
                    </div>
                )}
            </div>

            <h1 className="text-3xl font-black mb-4 tracking-tight">
                {verifying ? "Verifying Email" : verified ? "Email Verified" : "Security Breach"}
            </h1>

            <p className="text-muted-foreground mb-10 font-medium leading-relaxed max-w-sm mx-auto">
                {verifying
                    ? "We are verifying your credentials and securing your workspace."
                    : verified
                        ? "Authentication successful! Your workspace is now ready and secured."
                        : "The Verification link has expired or is invalid. Please request a new one."}
            </p>

            <Link
                href="/auth/login"
                className={`inline-block w-full py-4 ${verified ? 'bg-primary hover:bg-blue-600' : 'bg-secondary hover:bg-secondary/80'} text-white font-bold rounded-2xl transition-all active:scale-[0.98] shadow-lg ${verified ? 'shadow-primary/20' : ''}`}
            >
                Back to Login
            </Link>

            <p className="mt-8 text-[10px] text-muted-foreground uppercase font-bold tracking-widest opacity-40 italic">
                Secure Identity Protocol v2.0
            </p>
        </div>
    );
}

export default function VerifyEmail() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="w-full max-w-md animate-in fade-in zoom-in duration-500 z-10">
                <Suspense fallback={
                    <div className="glass-card p-12 rounded-3xl text-center">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                        <h1 className="text-xl font-bold opacity-50 uppercase tracking-widest">Verifying...</h1>
                    </div>
                }>
                    <VerifyEmailContent />
                </Suspense>
            </div>
        </div>
    );
}
