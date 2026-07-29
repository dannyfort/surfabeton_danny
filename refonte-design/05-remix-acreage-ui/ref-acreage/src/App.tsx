/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import HeroSection from './components/HeroSection';
import LogoMarquee from './components/LogoMarquee';
import StatsSection from './components/StatsSection';
import ImageSection from './components/ImageSection';
import NextSection from './components/NextSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="bg-black min-h-screen font-sans text-white">
      <HeroSection />
      <StatsSection />
      <LogoMarquee />
      <ImageSection />
      <NextSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
