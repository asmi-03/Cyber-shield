import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HeroScene from './components/HeroScene';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WebsiteChecker from './components/WebsiteChecker';
import About from './components/About';
import Stats from './components/Stats';

import FeatureSection from './components/FeatureSection';
import Offerings from './components/Offerings';
import Services from './components/Services';
import WhyChooseUs from './components/WhyChooseUs';
import FAQ from './components/FAQ';
import Blog from './components/Blog';
import Footer from './components/Footer';
import Contact from './components/Contact';
import Dashboard from './pages/Dashboard';
import { AnimatePresence } from 'framer-motion';

function Home() {
  return (
    <>
      <HeroScene />
      <Hero />
      <About />
      <Stats />

      <WhyChooseUs />
      <Services />
      <FeatureSection />
      <Offerings />
      <FAQ />
      <Blog />
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/check-website" element={<WebsiteChecker />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
