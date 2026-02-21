"use client";

import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Problem } from "@/components/problem";
import { Solution } from "@/components/solution";
import { TechStack } from "@/components/tech-stack";
import { Comparison } from "@/components/comparison";
import { ShieldSimulation } from "@/components/shield-simulation";
import BackgroundParticles from "@/components/background-particles";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { SignedIn, SignedOut, SignUpButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="min-h-screen relative selection:bg-primary/30">
      <BackgroundParticles />
      <Navbar />
      <Hero />
      <ShieldSimulation />
      <Problem />
      <Solution />
      <TechStack />
      <Comparison />

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter text-white">
              {"Simple, transparent pricing.".split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="inline-block mr-[0.2em]"
                >
                  {word}
                </motion.span>
              ))}
            </h2>
            <p className="text-muted text-lg font-light">Protect your team, no matter the size.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PricingCard
              tier="Starter"
              price="Free"
              description="For individuals and small teams shipping fast."
              features={["Up to 5 users", "Basic checklists", "CLI integration", "History (7 days)"]}
            />
            <PricingCard
              tier="Pro"
              price="$5"
              description="For growing teams that need prevention at scale."
              features={["Up to 25 users", "Risk scoring engine", "Custom logic rules", "History (Unlimited)", "Slack integration"]}
              highlight
            />
            <PricingCard
              tier="Enterprise"
              price="Custom"
              description="For organizations with complex compliance needs."
              features={["Unlimited users", "On-prem deployment", "Advanced audit logs", "SSO & SAML", "Dedicate Support"]}
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto rounded-3xl p-12 bg-secondary/50 border border-white/10 glass-morphism relative overflow-hidden text-center shadow-[0_0_50px_rgba(0,0,0,0.3)]">

          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 relative z-10 tracking-tighter">
            {"Stop the next outage today.".split(" ").map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="inline-block mr-[0.2em]"
              >
                {word}
              </motion.span>
            ))}
          </h2>
          <p className="text-muted text-lg mb-10 relative z-10 font-medium max-w-xl mx-auto">Built for teams that prioritize safety without sacrificing velocity</p>
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="inline-block px-10 py-5 bg-primary text-white font-black rounded-xl hover:scale-105 transition-all relative z-10 shadow-2xl cursor-pointer">
                Get Started for Free
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <a
              href="/dashboard"
              className="inline-block px-10 py-5 bg-primary text-white font-black rounded-xl hover:scale-105 transition-all relative z-10 shadow-2xl"
            >
              Go to Dashboard
            </a>
          </SignedIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-white/5 bg-secondary/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center">
              <div className="relative w-40 h-40 flex items-center justify-center -my-12">
                <img
                  src="/Assure.png"
                  alt="Assure Logo"
                  className="w-full h-full object-contain mix-blend-screen scale-150"
                />
              </div>
            </div>
            <div className="flex gap-12 text-sm font-bold text-muted uppercase tracking-widest">
              <a href="https://github.com/RichardRajuChirayath/Assure" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">GitHub</a>
            </div>
            <p className="text-muted text-sm font-medium opacity-50">© 2026 Assure Technologies Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

function PricingCard({ tier, price, description, features, highlight = false }: any) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`p-10 rounded-[32px] border ${highlight ? 'border-primary bg-primary/5 shadow-[0_0_30px_rgba(124,105,239,0.15)]' : 'border-white/5 bg-background'} flex flex-col`}
    >
      <div className="mb-8">
        <h3 className="text-2xl font-black mb-3 text-white">{tier}</h3>
        <p className="text-sm text-muted leading-relaxed font-medium">{description}</p>
      </div>
      <div className="mb-10">
        <span className="text-5xl font-black text-white tracking-tighter">{price}</span>
        {price !== "Free" && price !== "Custom" && <span className="text-muted text-sm font-bold uppercase tracking-widest"> / month</span>}
      </div>
      <div className="space-y-5 mb-12 flex-grow">
        {features.map((feature: string, i: number) => (
          <div key={i} className="flex items-start gap-4 text-sm text-zinc-300 font-medium">
            <Check className="w-5 h-5 text-primary flex-shrink-0" />
            <span className="leading-tight">{feature}</span>
          </div>
        ))}
      </div>
      <SignedOut>
        <SignUpButton mode="modal">
          <button
            className={`w-full py-5 rounded-2xl font-black text-center transition-all cursor-pointer ${highlight ? 'bg-primary text-white hover:bg-violet-600 shadow-xl shadow-primary/20' : 'bg-white/5 text-white hover:bg-white/10'}`}
          >
            {tier === "Enterprise" ? "Contact Sales" : "Choose " + tier}
          </button>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <a
          href="/dashboard"
          className={`w-full py-5 rounded-2xl font-black text-center transition-all ${highlight ? 'bg-primary text-white hover:bg-violet-600 shadow-xl shadow-primary/20' : 'bg-white/5 text-white hover:bg-white/10'}`}
        >
          Go to Dashboard
        </a>
      </SignedIn>
    </motion.div>
  );
}
