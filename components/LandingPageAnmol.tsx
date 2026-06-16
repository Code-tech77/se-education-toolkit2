"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Terminal, Sparkles, CheckCircle } from "lucide-react";

const LandingPageA: React.FC = () => {
  return (
    <div className="relative w-full min-h-screen bg-navy-950 overflow-hidden flex items-center justify-center pt-20">
      {/* Subtle Geometric Grid */}
      <div className="absolute inset-0 bg-grid-pattern-dark opacity-40 pointer-events-none" />

      {/* Background animated gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -60, 40, 0],
            scale: [1, 1.15, 0.9, 1],
            opacity: [0.25, 0.35, 0.2, 0.25]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-navy-700 blur-[140px]"
        />
        <motion.div
          animate={{
            x: [0, -50, 30, 0],
            y: [0, 40, -50, 0],
            scale: [1, 1.25, 0.95, 1],
            opacity: [0.2, 0.35, 0.15, 0.2]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[30%] -right-[15%] w-[55%] h-[65%] rounded-full bg-accent-indigo/25 blur-[160px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 0.8, 1],
            opacity: [0.15, 0.25, 0.1, 0.15]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute bottom-[-10%] left-[25%] w-[40%] h-[40%] rounded-full bg-accent-sky/20 blur-[120px]"
        />
      </div>

      {/* Main Grid Hero Layout */}
      <div className="container mx-auto px-4 md:px-8 relative z-10 w-full max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center py-12 lg:py-20">

          {/* Left Column: Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center space-x-2 py-1.5 px-4 rounded-full bg-navy-800/80 border border-white/10 text-accent-sky text-xs font-bold mb-6 tracking-wider shadow-inner backdrop-blur-sm">
                <Sparkles size={14} className="animate-pulse" />
                <span>REVOLUTIONIZING SOFTWARE EDUCATION</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 text-white leading-[1.1] tracking-tighter"
            >
              Shape the Future of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-sky via-accent-light to-white">
                Software Engineering
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-slate-100 max-w-2xl mb-8 leading-relaxed"
            >
              An open-source toolkit for SE education using Large Language Models.
              Master Requirements Engineering and UML design through interactive lab exercises with instant, AI-guided feedback.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4 w-full sm:w-auto"
            >
              <Link
                href="/labs"
                className="group relative flex items-center justify-center px-8 py-4 font-bold text-white bg-accent-blue rounded-full overflow-hidden transition-all hover:scale-105 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] w-full sm:w-auto text-sm sm:text-base"
              >
                <span>Explore Labs</span>
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/about"
                className="flex items-center justify-center px-8 py-4 font-bold text-slate-200 border border-white/10 rounded-full bg-white/5 hover:bg-white/10 transition-all hover:scale-105 w-full sm:w-auto text-sm sm:text-base"
              >
                <span>About Project</span>
              </Link>
            </motion.div>

            {/* Statistics Banner */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mt-12 pt-8 border-t border-white/5 w-full grid grid-cols-3 gap-6"
            >
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">100%</p>
                <p className="text-xs text-slate-200 mt-1 uppercase tracking-wider font-semibold">Open Source</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">8+</p>
                <p className="text-xs text-slate-200 mt-1 uppercase tracking-wider font-semibold">Lab Modules</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">3</p>
                <p className="text-xs text-slate-200 mt-1 uppercase tracking-wider font-semibold">AI Mentors</p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Visual Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2, type: "spring" }}
            className="lg:col-span-5 relative hidden lg:block"
          >
            {/* Visual Container representing AI Workbench */}
            <div className="relative w-full aspect-square max-w-[480px] mx-auto rounded-3xl border border-white/10 glass-dark p-6 shadow-2xl flex flex-col justify-between">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <Terminal className="text-accent-sky w-5 h-5" />
                  <span className="text-xs font-mono text-slate-200">AI-WORKBENCH // USER_STORY</span>
                </div>
                <div className="flex space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
              </div>

              {/* Central Graph/Flow Illustration */}
              <div className="flex-1 py-6 relative flex flex-col justify-center gap-6">

                {/* Floating Card 1: User Input */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="bg-navy-800/95 border border-white/10 rounded-xl p-4 shadow-lg w-4/5 z-10 self-start"
                >
                  <p className="text-2xs font-semibold text-accent-indigo uppercase tracking-wider mb-1">Step 1: User Story</p>
                  <p className="text-xs text-white italic font-medium">"As a user, I want to filter lab exercises by topic..."</p>
                </motion.div>

                {/* Connecting Line (SVG Animated Path) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                  <path
                    d="M 180, 110 C 180, 160 220, 140 220, 190"
                    fill="none"
                    stroke="rgba(56, 189, 248, 0.25)"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                  <path
                    d="M 180, 110 C 180, 160 220, 140 220, 190"
                    fill="none"
                    stroke="url(#grad)"
                    strokeWidth="2"
                    strokeDasharray="8 100"
                    strokeDashoffset="0"
                    className="animate-pulse"
                  >
                    <animate attributeName="stroke-dashoffset" values="100;0" dur="4s" repeatCount="indefinite" />
                  </path>
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Floating Card 2: AI Evaluator */}
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                  className="bg-navy-900 border border-accent-indigo/30 rounded-xl p-4 shadow-lg w-4/5 self-end z-10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-2xs font-semibold text-accent-sky uppercase tracking-wider">Step 2: AI Feedback</p>
                    <span className="text-2xs bg-green-500/10 text-green-400 py-0.5 px-2 rounded-full font-bold flex items-center gap-1">
                      <CheckCircle size={10} /> Passed
                    </span>
                  </div>
                  <p className="text-xs text-slate-100">"Your acceptance criteria captures the constraints correctly. Great structure!"</p>
                </motion.div>
              </div>

              {/* Footer Panel */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-2xs font-mono text-slate-300">AI CHATBOT: INTEGRATED</span>
                <span className="text-2xs font-mono text-slate-300">UML CONTEXT: ENABLED</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default LandingPageA;
