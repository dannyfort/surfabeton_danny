import React from 'react';
import { motion } from 'motion/react';
import { Player } from '@lottiefiles/react-lottie-player';
import Typewriter from './Typewriter';

export default function ImageSection() {
  return (
    <section id="services" className="w-full relative overflow-hidden flex flex-col justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://github.com/dsMagnatov/Acreage-landing-assets/blob/main/1.jpg?raw=true" 
          alt="Agriculture Field" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full mx-auto px-6 md:px-12 lg:px-[120px] py-8 md:py-24 flex flex-col h-full justify-between gap-4 md:gap-24">
        
        {/* Top Content: Headline & Subheadline & Button */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 w-full items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="md:col-span-2"
          >
            <h2 className="text-[clamp(1.5rem,4vw,3.5rem)] font-medium tracking-tight text-white mb-6 leading-[1.1] max-w-[800px]">
              <Typewriter text="A Highly Efficient, Precision-Driven Harvesting Process Built For " delay={0} speed={0.012} /><span className="font-dm-serif italic font-normal"><Typewriter text="Maximum Yield" delay={0.8} speed={0.012} /></span>
            </h2>
            <p className="text-lg md:text-[24px] text-white/80 font-light tracking-wide">
              <Typewriter text="Precision in every pass." delay={0.1} speed={0.012} />
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="hidden md:flex justify-end w-full max-w-[421px] pb-1"
          >
            <button 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 py-2.5 rounded-full bg-white text-black hover:bg-black hover:text-white transition-colors duration-300 text-sm tracking-wide font-medium"
            >
              Schedule Service
            </button>
          </motion.div>
        </div>

        {/* Bottom Content: 3 Columns (How it works) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 w-full md:mt-[200px]">
          
          {/* Column 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="flex flex-col w-full max-w-[420px]"
          >
            <div className="w-12 h-12 mb-6 flex items-center justify-center overflow-hidden">
              <Player src="https://raw.githubusercontent.com/dsMagnatov/Acreage-landing-assets/refs/heads/main/curry.json" loop autoplay style={{ width: '48px', height: '48px', filter: 'brightness(0) invert(1)' }} />
            </div>
            <div className="w-full h-px bg-white/20 mb-6"></div>
            <h3 className="text-2xl font-medium text-white mb-3"><Typewriter text="Sustainable Crop Care" delay={0.1} speed={0.012} /></h3>
            <p className="text-sm text-white/70 leading-relaxed max-w-[340px]"><Typewriter text="Nurturing your fields with eco-friendly practices to ensure healthy growth and robust yields." delay={0.1} speed={0.012} /></p>
          </motion.div>

          {/* Column 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="flex flex-col w-full max-w-[420px]"
          >
            <div className="w-12 h-12 mb-6 flex items-center justify-center overflow-hidden">
              <Player src="https://raw.githubusercontent.com/dsMagnatov/Acreage-landing-assets/refs/heads/main/tractor.json" loop autoplay style={{ width: '48px', height: '48px', filter: 'brightness(0) invert(1)' }} />
            </div>
            <div className="w-full h-px bg-white/20 mb-6"></div>
            <h3 className="text-2xl font-medium text-white mb-3"><Typewriter text="Advanced Machinery" delay={0.1} speed={0.012} /></h3>
            <p className="text-sm text-white/70 leading-relaxed max-w-[340px]"><Typewriter text="Deploying state-of-the-art tractors and harvesters for maximum efficiency and speed." delay={0.1} speed={0.012} /></p>
          </motion.div>

          {/* Column 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="flex flex-col w-full max-w-[421px]"
          >
            <div className="w-12 h-12 mb-6 flex items-center justify-center overflow-hidden">
              <Player src="https://raw.githubusercontent.com/dsMagnatov/Acreage-landing-assets/refs/heads/main/beetle.json" loop autoplay style={{ width: '48px', height: '48px', filter: 'brightness(0) invert(1)' }} />
            </div>
            <div className="w-full h-px bg-white/20 mb-6"></div>
            <h3 className="text-2xl font-medium text-white mb-3"><Typewriter text="Smart Pest Management" delay={0.1} speed={0.012} /></h3>
            <p className="text-sm text-white/70 leading-relaxed max-w-[340px]"><Typewriter text="Protecting your harvest by monitoring and managing field ecosystems with precision." delay={0.1} speed={0.012} /></p>
          </motion.div>

        </div>

        {/* Mobile Button (Shows below icons) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="flex md:hidden justify-start w-full"
        >
          <button 
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-6 py-2.5 rounded-full bg-white text-black hover:bg-black hover:text-white transition-colors duration-300 text-sm tracking-wide font-medium"
          >
            Schedule Service
          </button>
        </motion.div>
      </div>
    </section>
  );
}
