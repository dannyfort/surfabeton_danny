import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Typewriter from './Typewriter';

export default function HeroSection() {
  const [isOverWhiteBg, setIsOverWhiteBg] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const feedbackSection = document.getElementById('feedback');
      if (feedbackSection) {
        // Trigger when the feedback section is within 80px of the top (header height + offset)
        const triggerPoint = feedbackSection.offsetTop - 80;
        setIsOverWhiteBg(window.scrollY >= triggerPoint);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white font-sans overflow-hidden flex flex-col">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        webkit-playsinline="true"
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
      >
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260415_055504_9e18aed7-c0bd-4b99-b587-d3c2adf36401.mp4" type="video/mp4" />
      </video>

      {/* Gradient transition to black at the bottom */}
      <div className="absolute bottom-0 left-0 w-full h-40 md:h-64 bg-gradient-to-t from-black to-transparent z-0 pointer-events-none"></div>

      {/* Navigation Bar (Top Center Pill) */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 md:gap-4 p-2 rounded-full backdrop-blur-md text-sm transition-all duration-300 ${
          isOverWhiteBg 
            ? 'bg-black border border-transparent text-white/[0.64]' 
            : 'bg-white/5 border border-white/20 text-gray-300'
        }`}
      >
        <a href="#stats" onClick={(e) => { e.preventDefault(); document.getElementById('stats')?.scrollIntoView({ behavior: 'smooth' }); }} className="px-4 py-2 rounded-full hover:bg-white hover:text-black transition-all duration-300 whitespace-nowrap hidden md:block">Impact</a>
        <a href="#services" onClick={(e) => { e.preventDefault(); document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }); }} className="px-4 py-2 rounded-full hover:bg-white hover:text-black transition-all duration-300 whitespace-nowrap hidden md:block">Services</a>
        
        {/* Logo */}
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center justify-center px-4 hover:opacity-80 transition-opacity"
          aria-label="Scroll to top"
        >
          <svg viewBox="0 0 100 100" className="w-8 h-8 text-white" fill="currentColor">
            <path strokeWidth="0" d="m53.54,45.42c2.19-3.79,7.67-3.79,9.86,0l4.54,7.87c1.17,2.02,1.17,4.51,0,6.54l-8.15,13.81c-1.68,2.91.42,6.55,3.78,6.55h17.81c3.45,0,5.61-3.74,3.89-6.73l-28.76-49.81c-2.95-5.12-10.34-5.12-13.29,0l-28.46,49.3c-1.86,3.22.46,7.24,4.18,7.24h10.23c2.55,0,4.91-1.36,6.19-3.57l18.18-31.19Z"/>
          </svg>
        </button>
        
        <a href="#feedback" onClick={(e) => { e.preventDefault(); document.getElementById('feedback')?.scrollIntoView({ behavior: 'smooth' }); }} className="px-4 py-2 rounded-full hover:bg-white hover:text-black transition-all duration-300 whitespace-nowrap hidden md:block">Feedback</a>
        <a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }} className="px-4 py-2 rounded-full hover:bg-white hover:text-black transition-all duration-300 whitespace-nowrap hidden md:block">Contact Us</a>
        
        {/* Mobile menu trigger (visible only on small screens) */}
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden px-4 py-2 rounded-full hover:bg-white hover:text-black transition-all duration-300"
        >
          Menu
        </button>
      </motion.nav>

      {/* Main Content Area (Pushed to bottom) */}
      <main className="flex-1 flex flex-col justify-end relative z-10 w-full mx-auto px-6 md:px-12 lg:px-[120px] pb-8">
        
        {/* Content Grid */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6 lg:gap-12 border-b border-white/10 pb-10 mb-6">
          
          {/* Left Column: Title & Subtitle */}
          <div className="flex flex-col justify-start items-start pr-4 lg:pr-8 w-full flex-1">
            <motion.h1 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 1 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.025, delayChildren: 0 }
                }
              }}
              className="text-[clamp(2rem,5vw,72px)] font-medium tracking-tight text-white mb-4 leading-[1.1] w-full max-w-[920px]"
            >
              {"Experience the standard".split("").map((char, i) => (
                <motion.span key={`1-${i}`} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>{char}</motion.span>
              ))}
              <br />
              {"of ".split("").map((char, i) => (
                <motion.span key={`2-${i}`} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>{char}</motion.span>
              ))}
              <span className="font-dm-serif italic font-normal">
                {"Precision Farming".split("").map((char, i) => (
                  <motion.span key={`3-${i}`} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>{char}</motion.span>
                ))}
              </span>
            </motion.h1>
            <p className="text-lg md:text-[24px] text-white/80 font-light tracking-wide">
              <Typewriter text="Yield with efficiency." delay={0.1} speed={0.012} />
            </p>
          </div>

          {/* Right Column: Button & Description */}
          <div className="flex flex-col items-start w-full lg:w-[400px] xl:w-[480px] shrink-0">
            <div className="order-1 lg:order-2 space-y-2 lg:space-y-4 text-sm md:text-base text-white/80 leading-relaxed font-light">
              <p>
                <Typewriter text="A professional harvesting service that helps you clear fields faster, reduce crop loss, and secure yields that matter." delay={0.1} speed={0.012} />
              </p>
              <p>
                <Typewriter text="We go beyond reaping — deploying modern machinery in real time, operating with skilled crews, and handling your crops with speed and precision." delay={0.1} speed={0.012} />
              </p>
            </div>
            <motion.button 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="order-2 lg:order-1 mt-8 lg:mt-0 lg:mb-8 px-6 py-2.5 rounded-full border border-white/30 hover:bg-white text-white hover:text-black transition-colors duration-300 backdrop-blur-sm text-sm tracking-wide"
            >
              Schedule Now
            </motion.button>
          </div>
          
        </div>

        {/* Footer Text Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-white/[0.64] tracking-wide">
          <p className="mb-2 sm:mb-0"><Typewriter text="Abundance begins with a timely harvest." delay={0.1} speed={0.012} /></p>
          <p><Typewriter text="Acreage Ag ©2026" delay={0.1} speed={0.012} /></p>
        </div>
        
      </main>

      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 w-full z-[70] bg-black border-t border-white/20 rounded-t-3xl flex flex-col px-6 py-8 md:hidden"
          >
            <div className="flex justify-between items-center mb-6">
              <span className="text-white/50 text-sm uppercase tracking-widest">Menu</span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col">
              <a 
                href="#stats" 
                onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); document.getElementById('stats')?.scrollIntoView({ behavior: 'smooth' }); }} 
                className="py-4 text-lg text-white border-b border-white/[0.16]"
              >
                Impact
              </a>
              <a 
                href="#services" 
                onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }); }} 
                className="py-4 text-lg text-white border-b border-white/[0.16]"
              >
                Services
              </a>
              <a 
                href="#feedback" 
                onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); document.getElementById('feedback')?.scrollIntoView({ behavior: 'smooth' }); }} 
                className="py-4 text-lg text-white border-b border-white/[0.16]"
              >
                Feedback
              </a>
              <a 
                href="#contact" 
                onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }} 
                className="py-4 text-lg text-white"
              >
                Contact Us
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
