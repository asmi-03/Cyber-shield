import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import ChatBot from './components/ChatBot';
import Dashboard from './pages/Dashboard';

function Home() {
  return (
    <>
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

function AppLayout({ children }) {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  if (isDashboard) {
    return <main className="dashboard-layout">{children}</main>;
  }

  return (
    <div className="app-container">
      <HeroScene />
      <Navbar />
      <main>
        {children}
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/check-website" element={<WebsiteChecker />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
