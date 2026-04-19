'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function RootPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#05070B] text-[#F5F7FB]">
      
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4DA2FF]/10 blur-[120px]" />
        <div className="absolute left-[20%] top-[30%] h-[300px] w-[300px] rounded-full bg-[#2DE2E6]/10 blur-[100px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-sora text-4xl md:text-5xl font-bold tracking-tight"
        >
          Planetlocksmiths
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-4 text-[#95A0B8] max-w-md mx-auto"
        >
          Automotive locksmith service across Philadelphia.  
          24/7 mobile response, urgent and same-day availability.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="/en"
            className="rounded-full bg-[#4DA2FF] px-6 py-3 font-semibold text-black transition hover:scale-[1.03] active:scale-[0.97]"
          >
            English
          </Link>

          <Link
            href="/es"
            className="rounded-full border border-white/10 bg-[#0B1020] px-6 py-3 font-semibold transition hover:border-[#4DA2FF]"
          >
            Español
          </Link>

          <Link
            href="/ru"
            className="rounded-full border border-white/10 bg-[#0B1020] px-6 py-3 font-semibold transition hover:border-[#4DA2FF]"
          >
            Русский
          </Link>
        </motion.div>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-10 flex flex-wrap justify-center gap-3 text-sm text-[#95A0B8]"
        >
          <span className="rounded-full border border-white/10 px-3 py-1">
            24/7 Mobile Service
          </span>
          <span className="rounded-full border border-white/10 px-3 py-1">
            Philadelphia Coverage
          </span>
          <span className="rounded-full border border-white/10 px-3 py-1">
            Car Keys & Programming
          </span>
        </motion.div>

      </div>
    </main>
  );
}
