import React from 'react';
import { Calendar, Award, Activity, Compass, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { TrainerSettings } from '../../types';
import { IMAGES } from '../../lib/images';

interface HeroProps {
  trainerSettings: TrainerSettings | null;
  onBookNow: () => void;
  onViewServices: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  trainerSettings,
  onBookNow,
  onViewServices,
}) => {
  const trainerName = trainerSettings?.trainer_name || 'Marcus Vance, CSCS';

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] pt-28 pb-16 flex items-center justify-center overflow-hidden bg-[#07090d]"
    >
      {/* Dynamic Background Image with Layered Gradient Overlays for Guaranteed High Contrast */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <img
          src={IMAGES.hero.url}
          alt={IMAGES.hero.alt}
          className="w-full h-full object-cover object-center scale-105 opacity-35 filter contrast-125 brightness-75 transition-all duration-1000"
          loading="eager"
        />
        {/* Layered lighting gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07090d] via-[#07090d]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07090d] via-[#07090d]/70 to-transparent" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Expressive, Confident Typography & Action */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Coach Certification Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-emerald-500/30 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold tracking-wider text-emerald-300 uppercase font-mono">
                Elite 1-on-1 Performance Coaching
              </span>
              <span className="text-gray-500">•</span>
              <span className="text-xs text-gray-300 font-medium">Private Studio Facility</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
              ENGINEER YOUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                HIGHEST STRENGTH
              </span>
              <br />
              & MOVEMENT MASTERY.
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl leading-relaxed font-normal">
              No generic routines or guesswork. Work directly with{' '}
              <strong className="text-white font-semibold">{trainerName}</strong> to build athletic
              resilience, compound strength, and joint longevity through science-grounded
              biomechanical coaching.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                id="hero-book-now-btn"
                onClick={onBookNow}
                className="px-7 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2.5 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Reserve Training Session</span>
              </button>

              <button
                id="hero-view-services-btn"
                onClick={onViewServices}
                className="px-6 py-3.5 rounded-xl text-sm font-semibold text-gray-200 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Coaching Services</span>
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              </button>
            </div>

            {/* Credibility Pillars */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 max-w-xl">
              <div>
                <div className="text-2xl font-black text-white font-mono">100%</div>
                <div className="text-xs text-gray-400 font-medium mt-0.5">Biomechanical Customization</div>
              </div>
              <div>
                <div className="text-2xl font-black text-emerald-400 font-mono">1-ON-1</div>
                <div className="text-xs text-gray-400 font-medium mt-0.5">Focused Private Attention</div>
              </div>
              <div>
                <div className="text-2xl font-black text-white font-mono">CSCS</div>
                <div className="text-xs text-gray-400 font-medium mt-0.5">Certified Strength Specialist</div>
              </div>
            </div>
          </div>

          {/* Right Column: Layered Visual Storytelling with Real Gym Depth & Real-time Live Badge */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Decorative Back Glow */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-emerald-500/30 to-cyan-500/20 blur-xl opacity-70" />

              {/* Main Visual Card */}
              <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-[#0e1219] shadow-2xl">
                <div className="aspect-[4/5] relative overflow-hidden group">
                  <img
                    src={IMAGES.trainerAction.url}
                    alt={IMAGES.trainerAction.alt}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-95 contrast-110"
                  />
                  {/* Subtle Inner Gradient for Contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090b10] via-transparent to-black/30" />

                  {/* Top Floating Badge */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                    <div className="px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-xs font-semibold text-white tracking-wide">Live Session Availability</span>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center">
                      <Award className="w-4 h-4 text-emerald-400" />
                    </div>
                  </div>

                  {/* Bottom Information Card Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#0a0d14]/90 backdrop-blur-md border border-white/10 space-y-2 text-left">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-emerald-400 font-mono font-semibold uppercase tracking-wider">
                        Current Focus
                      </span>
                      <span className="text-gray-400">Next Available Today</span>
                    </div>
                    <div className="text-sm font-bold text-white tracking-wide">
                      Compound Strength & Kinetic Alignment
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-300 pt-1 border-t border-white/5">
                      <span className="flex items-center gap-1 text-gray-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Form Calibration
                      </span>
                      <span className="flex items-center gap-1 text-gray-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Load Progression
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Accent Card */}
              <div className="hidden sm:flex absolute -bottom-6 -left-6 p-4 rounded-xl bg-[#0c1017] border border-white/15 shadow-2xl backdrop-blur-lg items-center gap-3.5 max-w-xs text-left">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <Compass className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Direct Coach Communication</div>
                  <div className="text-[11px] text-gray-400">Instant confirmation & prep notes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
