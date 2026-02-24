import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Task Workspace",
  description: "Task Workspace Project in NEXT JS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
            // Define default options
            className: "",
            duration: 5000,
            style: {
              background: "#333",
              color: "#fff",
              padding: "16px",
              borderRadius: "8px",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(5px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              zIndex: 9999,
              fontFamily: "var(--font-geist-sans)",
            },

            // Default options for specific types
            success: {
              duration: 3000,
              iconTheme: {
                primary: "#4ade80",
                secondary: "#fff",
              },
              style: {
                background: "rgba(20, 20, 20, 0.9)",
                color: "#e2e8f0",
                border: "1px solid #22c55e",
              },
            },

            error: {
              duration: 4000,
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
              style: {
                background: "rgba(20, 20, 20, 0.9)",
                color: "#e2e8f0",
                border: "1px solid #ef4444",
              },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
