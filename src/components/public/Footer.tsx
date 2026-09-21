import React from 'react';
import { Dumbbell, Shield, MapPin, Mail, Phone, Clock } from 'lucide-react';
import { TrainerSettings, BusinessHours } from '../../types';

interface FooterProps {
  trainerSettings: TrainerSettings | null;
  businessHours: BusinessHours[];
  onOpenAdmin: () => void;
  onNavigateToBooking: () => void;
}

const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const Footer: React.FC<FooterProps> = ({
  trainerSettings,
  businessHours,
  onOpenAdmin,
  onNavigateToBooking,
}) => {
  const trainerName = trainerSettings?.trainer_name || 'Marcus Vance, CSCS';
  const trainerEmail = trainerSettings?.trainer_email || 'marcus@apexperformance.com';
  const trainerPhone = trainerSettings?.trainer_phone || '+1 (415) 890-3240';
  const trainerAddress = trainerSettings?.trainer_address || '480 Performance Blvd, Studio 4A, San Francisco, CA';

  return (
    <footer id="main-footer" className="bg-[#05070a] border-t border-white/10 text-left pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-[#090b10] rounded-[10px] flex items-center justify-center">
                  <Dumbbell className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
              <div>
                <span className="block text-base font-black tracking-wider text-white uppercase font-mono">
                  {trainerName.split(',')[0]}
                </span>
                <span className="block text-[10px] font-semibold tracking-widest text-emerald-400 uppercase">
                  Personal Training & Coaching
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              Dedicated one-on-one personal coaching, kinetic analysis, and customized strength progression
              designed for sustainable high performance and injury resilience.
            </p>

            <div className="pt-2">
              <button
                id="footer-book-btn"
                onClick={onNavigateToBooking}
                className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Book Training Session</span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-gray-300 font-semibold">
              Navigation
            </div>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <a href="#services" className="hover:text-emerald-400 transition-colors">
                  Coaching Services
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-emerald-400 transition-colors">
                  Philosophy & Bio
                </a>
              </li>
              <li>
                <a
                  href="#booking"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateToBooking();
                  }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Schedule Session
                </a>
              </li>
              <li>
                <a href="#location" className="hover:text-emerald-400 transition-colors">
                  Facility Info
                </a>
              </li>
            </ul>
          </div>

          {/* Studio Hours Summary */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-gray-300 font-semibold flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Coaching Hours</span>
            </div>
            <div className="space-y-1.5 text-xs text-gray-400 font-mono">
              {businessHours.length > 0 ? (
                businessHours.map((bh) => (
                  <div key={bh.id} className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-300">{WEEKDAY_NAMES[bh.weekday] || `Day ${bh.weekday}`}:</span>
                    <span>
                      {bh.is_open
                        ? `${bh.start_time.substring(0, 5)} - ${bh.end_time.substring(0, 5)}`
                        : 'Closed'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-gray-500">Mon - Fri: 7:00 AM - 7:00 PM</div>
              )}
            </div>
          </div>

          {/* Facility Location */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-gray-300 font-semibold">
              Contact & Studio
            </div>
            <div className="space-y-2.5 text-xs text-gray-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{trainerAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`mailto:${trainerEmail}`} className="hover:text-emerald-400 truncate">
                  {trainerEmail}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${trainerPhone}`} className="hover:text-emerald-400">
                  {trainerPhone}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Admin Portal trigger */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            © {new Date().getFullYear()} {trainerName}. All rights reserved. Precision strength & performance coaching.
          </div>

          <div className="flex items-center gap-4">
            <button
              id="footer-admin-link"
              onClick={onOpenAdmin}
              className="hover:text-gray-300 flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400/80" />
              <span>Coach Portal (Admin)</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
