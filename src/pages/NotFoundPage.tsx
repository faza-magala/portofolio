import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FBFF] text-[#172B4D]">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="w-16 h-16 rounded-3xl bg-[#EBF5FF] text-[#3898EC] flex items-center justify-center mb-6 shadow-md shadow-[#3898EC]/10">
          <Compass size={32} />
        </div>

        <span className="text-xs font-bold text-[#3898EC] tracking-widest uppercase mb-2">404 Error</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172B4D] tracking-tight mb-3">
          Page Not Found
        </h1>
        <p className="text-xs sm:text-sm text-[#5B6B82] max-w-md mb-8">
          The page you requested might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <div className="flex items-center space-x-3">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#3898EC] hover:bg-[#2483D6] text-white text-xs font-semibold shadow-md shadow-[#3898EC]/20 transition"
          >
            <Home size={15} />
            <span>Return to Home</span>
          </Link>
          <Link
            to="/blog"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#172B4D] text-xs font-semibold border border-[#DCEAF7] shadow-sm transition"
          >
            <span>Read Articles</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};
