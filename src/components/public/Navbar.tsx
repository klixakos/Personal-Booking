import React, { useState, useEffect } from 'react';
import { Dumbbell, Calendar, Shield, Menu, X, ArrowRight } from 'lucide-react';
import { TrainerSettings } from '../../types';

interface NavbarProps {
  trainerSettings: TrainerSettings | null;
  onNavigateToBooking: () => void;
  onOpenAdmin: () => void;
  isAdmin?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  trainerSettings,
  onNavigateToBooking,
  onOpenAdmin,
  isAdmin,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const trainerName = trainerSettings?.trainer_name || 'Marcus Vance';

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#07090d]/90 backdrop-blur-md border-b border-white/10 shadow-2xl shadow-black/60 py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#hero"
            id="nav-brand-link"
            className="flex items-center gap-3 group text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/30 transition-all">
              <div className="w-full h-full bg-[#090b10] rounded-[10px] flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <span className="block text-lg font-black tracking-wider text-white uppercase font-mono">
                {trainerName.split(',')[0]}
              </span>
              <span className="block text-[11px] font-semibold tracking-widest text-emerald-400/90 uppercase">
                Performance Coaching
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav id="desktop-nav-links" className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a
              href="#services"
              className="text-gray-300 hover:text-white transition-colors tracking-wide py-1"
            >
              Services
            </a>
            <a
              href="#about"
              className="text-gray-300 hover:text-white transition-colors tracking-wide py-1"
            >
              Coaching Philosophy
            </a>
            <a
              href="#booking"
              onClick={(e) => {
                e.preventDefault();
                onNavigateToBooking();
              }}
              className="text-gray-300 hover:text-white transition-colors tracking-wide py-1"
            >
              Reserve Session
            </a>
            <a
              href="#location"
              className="text-gray-300 hover:text-white transition-colors tracking-wide py-1"
            >
              Facility & Hours
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <button
              id="nav-coach-portal-btn"
              onClick={onOpenAdmin}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-white/5 hover:border-white/10 transition-all flex items-center gap-1.5"
              title="Trainer & Coach Login"
            >
              <Shield className="w-3.5 h-3.5 text-gray-400" />
              <span>Coach Portal</span>
            </button>

            <button
              id="nav-book-session-cta"
              onClick={onNavigateToBooking}
              className="px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all transform active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Session</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-80" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="md:hidden bg-[#0a0d14] border-b border-white/10 px-6 py-6 space-y-4 shadow-2xl animate-in slide-in-from-top duration-200"
        >
          <div className="flex flex-col gap-3 font-medium text-base">
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-300 hover:text-white py-2 border-b border-white/5"
            >
              Services & Programs
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-300 hover:text-white py-2 border-b border-white/5"
            >
              Coaching Philosophy
            </a>
            <a
              href="#booking"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateToBooking();
              }}
              className="text-gray-300 hover:text-white py-2 border-b border-white/5"
            >
              Reserve Session
            </a>
            <a
              href="#location"
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-300 hover:text-white py-2"
            >
              Studio Location & Hours
            </a>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <button
              id="mobile-book-cta"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateToBooking();
              }}
              className="w-full py-3 rounded-lg text-center text-sm font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Training Session</span>
            </button>
            <button
              id="mobile-coach-portal-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full py-2.5 rounded-lg text-center text-xs font-semibold text-gray-400 bg-white/5 border border-white/10 flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Coach Portal Login</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
