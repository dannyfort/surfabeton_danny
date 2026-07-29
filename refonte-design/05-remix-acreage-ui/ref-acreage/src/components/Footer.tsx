import React from 'react';
import { Twitter, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black py-16 px-6 md:px-12 lg:px-[120px] w-full border-t border-white/10">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
        
        {/* Logo & Name */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 100 100" className="w-12 h-12 text-white" fill="currentColor">
              <path strokeWidth="0" d="m53.54,45.42c2.19-3.79,7.67-3.79,9.86,0l4.54,7.87c1.17,2.02,1.17,4.51,0,6.54l-8.15,13.81c-1.68,2.91.42,6.55,3.78,6.55h17.81c3.45,0,5.61-3.74,3.89-6.73l-28.76-49.81c-2.95-5.12-10.34-5.12-13.29,0l-28.46,49.3c-1.86,3.22.46,7.24,4.18,7.24h10.23c2.55,0,4.91-1.36,6.19-3.57l18.18-31.19Z"/>
            </svg>
            <span className="text-white font-medium text-xl tracking-wide">Acreage Ag</span>
          </div>
          <p className="text-white/72 text-sm leading-relaxed max-w-[280px]">
            Precision farming and harvesting services for maximum yield and sustainable growth.
          </p>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-medium mb-2">Contact</h4>
          <a href="#" className="text-white/72 hover:text-white transition-colors duration-300 text-sm">
            123 Harvest Way<br />Heartland, IA 51546
          </a>
          <a href="tel:+15551234567" className="text-white/72 hover:text-white transition-colors duration-300 text-sm">
            +1 (555) 123-4567
          </a>
          <a href="mailto:hello@acreageag.com" className="text-white/72 hover:text-white transition-colors duration-300 text-sm">
            hello@acreageag.com
          </a>
        </div>

        {/* Menu */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-medium mb-2">Navigation</h4>
          <a href="#stats" onClick={(e) => { e.preventDefault(); document.getElementById('stats')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-white/72 hover:text-white transition-colors duration-300 text-sm w-fit">Impact</a>
          <a href="#services" onClick={(e) => { e.preventDefault(); document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-white/72 hover:text-white transition-colors duration-300 text-sm w-fit">Services</a>
          <a href="#feedback" onClick={(e) => { e.preventDefault(); document.getElementById('feedback')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-white/72 hover:text-white transition-colors duration-300 text-sm w-fit">Feedback</a>
          <a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-white/72 hover:text-white transition-colors duration-300 text-sm w-fit">Contact Us</a>
        </div>

        {/* Socials */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-medium mb-2">Follow Us</h4>
          <div className="flex gap-5">
            <a href="#" className="text-white/72 hover:text-white transition-colors duration-300" aria-label="Twitter">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-white/72 hover:text-white transition-colors duration-300" aria-label="LinkedIn">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="text-white/72 hover:text-white transition-colors duration-300" aria-label="Instagram">
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-[1440px] mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/72">
        <p>© 2026 Acreage Ag. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors duration-300">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
