"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 ${scrolled ? "bg-background/80 backdrop-blur-md border-b border-white/5 py-3" : "bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <a href="/" className="flex items-center group cursor-pointer">
                    <div className="relative w-40 h-40 group-hover:scale-105 transition-transform flex items-center justify-center -my-12 -mx-6">
                        <img
                            src="/Assure.png"
                            alt="Assure Logo"
                            className="w-full h-full object-contain mix-blend-screen scale-150"
                        />
                    </div>
                </a>

                <div className="hidden md:flex items-center gap-10">
                    <a href="/#problem" className="text-sm font-bold text-muted hover:text-white transition-colors uppercase tracking-widest">Problem</a>
                    <a href="/#solution" className="text-sm font-bold text-muted hover:text-white transition-colors uppercase tracking-widest">Solution</a>
                    <a href="/#comparison" className="text-sm font-bold text-muted hover:text-white transition-colors uppercase tracking-widest">Comparison</a>
                    <a href="/#pricing" className="text-sm font-bold text-muted hover:text-white transition-colors uppercase tracking-widest">Pricing</a>

                    <div className="flex items-center gap-4 border-l border-white/10 pl-10">
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="text-sm font-bold text-muted hover:text-white transition-colors uppercase tracking-widest cursor-pointer">
                                    Login
                                </button>
                            </SignInButton>
                            <SignUpButton mode="modal">
                                <button className="px-6 py-2.5 bg-primary text-white text-xs font-black rounded-xl hover:scale-105 transition-all shadow-lg shadow-primary/20 uppercase tracking-widest cursor-pointer">
                                    Get Started
                                </button>
                            </SignUpButton>
                        </SignedOut>
                        <SignedIn>
                            <a
                                href="/dashboard"
                                className="text-sm font-bold text-muted hover:text-white transition-colors uppercase tracking-widest"
                            >
                                Dashboard
                            </a>
                            <UserButton
                                appearance={{
                                    elements: {
                                        avatarBox: "w-10 h-10 rounded-xl border border-white/10 shadow-lg",
                                        userButtonPopoverCard: "bg-secondary border border-white/10 backdrop-blur-xl",
                                        userButtonPopoverActionButton: "hover:bg-white/5 transition-colors",
                                        userButtonPopoverActionButtonText: "text-zinc-300 font-bold",
                                        userButtonPopoverFooter: "hidden" // Hides the "Secured by Clerk" for a cleaner look
                                    }
                                }}
                            />
                        </SignedIn>
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}
