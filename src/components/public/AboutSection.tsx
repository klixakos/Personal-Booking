import React from 'react';
import { Target, CheckCircle2, ShieldCheck, Dumbbell, MapPin, Mail, Phone, Flame } from 'lucide-react';
import { TrainerSettings } from '../../types';
import { IMAGES } from '../../lib/images';

interface AboutSectionProps {
  trainerSettings: TrainerSettings | null;
  onBookConsultation: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  trainerSettings,
  onBookConsultation,
}) => {
  const trainerName = trainerSettings?.trainer_name || 'Marcus Vance, CSCS';
  const trainerEmail = trainerSettings?.trainer_email || 'marcus@apexperformance.com';
  const trainerPhone = trainerSettings?.trainer_phone || '+1 (415) 890-3240';
  const trainerAddress = trainerSettings?.trainer_address || '480 Performance Blvd, Studio 4A, San Francisco, CA';

  return (
    <section id="about" className="py-24 bg-[#07090d] relative overflow-hidden text-left">
      {/* Subtle glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual Storytelling & Authentic Coach Imagery */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="rounded-2xl overflow-hidden border border-white/15 bg-[#0e1219] shadow-2xl relative">
                <div className="aspect-[3/4] relative overflow-hidden">
                  <img
                    src={IMAGES.trainerPortrait.url}
                    alt={IMAGES.trainerPortrait.alt}
                    className="w-full h-full object-cover object-center filter brightness-95 contrast-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07090d] via-transparent to-black/20" />
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#07090d] via-[#07090d]/90 to-transparent space-y-2">
                  <div className="text-xl font-bold text-white tracking-wide">
                    {trainerName}
                  </div>
                  <div className="text-xs text-emerald-400 font-mono font-medium uppercase tracking-wider">
                    Head Performance Coach & Biomechanics Specialist
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed pt-1">
                    Specializing in structural strength development, joint durability, and athletic movement velocity.
                  </p>
                </div>
              </div>

              {/* Badges / Floating highlights */}
              <div className="hidden sm:flex absolute -top-5 -right-5 px-4 py-3 rounded-xl bg-[#0c1017] border border-white/15 shadow-2xl backdrop-blur-md items-center gap-3 text-left">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">NSCA CSCS Certified</div>
                  <div className="text-[10px] text-gray-400">Strength & Conditioning Specialist</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Coaching Philosophy & Standards */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold tracking-wider uppercase font-mono">
                <Target className="w-3.5 h-3.5" />
                The Coaching Philosophy
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                SUSTAINABLE PROGRESSION. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
                  UNCOMPROMISING STANDARDS.
                </span>
              </h2>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed font-normal">
                True strength is not measured by single-day fatigue or reckless volume. It is built through
                flawless execution, deliberate load progression, and respect for individual anatomy.
                Whether returning from plateaus or aiming for peak athletic output, our sessions are engineered
                for lifelong durability.
              </p>
            </div>

            {/* Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#0c1017] border border-white/10 space-y-2">
                <div className="flex items-center gap-2.5 text-white font-semibold text-sm">
                  <Flame className="w-4 h-4 text-emerald-400" />
                  <span>Progressive Overload</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Systematic micro-progressions tracked every session, ensuring adaptation without burnout.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0c1017] border border-white/10 space-y-2">
                <div className="flex items-center gap-2.5 text-white font-semibold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Joint Biomechanics First</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Lifting angles and setups tailored to your limb lengths, hip anatomy, and joint mechanics.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0c1017] border border-white/10 space-y-2">
                <div className="flex items-center gap-2.5 text-white font-semibold text-sm">
                  <Dumbbell className="w-4 h-4 text-emerald-400" />
                  <span>Compound Mastery</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Deep focus on multi-joint patterns—squatting, hinging, pressing, and rotational stability.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0c1017] border border-white/10 space-y-2">
                <div className="flex items-center gap-2.5 text-white font-semibold text-sm">
                  <Target className="w-4 h-4 text-emerald-400" />
                  <span>Total Accountability</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Transparent communication, recovery monitoring, and session prep guidance prior to every visit.
                </p>
              </div>
            </div>

            {/* Studio Contact / Facility Card */}
            <div id="location" className="p-5 rounded-2xl bg-[#0e131d] border border-white/15 space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                Facility & Direct Contact
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="flex items-start gap-2 text-gray-300">
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                  <span>{trainerAddress}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                  <a href={`mailto:${trainerEmail}`} className="hover:text-emerald-400 truncate">
                    {trainerEmail}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                  <a href={`tel:${trainerPhone}`} className="hover:text-emerald-400">
                    {trainerPhone}
                  </a>
                </div>
              </div>
            </div>

            {/* Action CTA */}
            <div>
              <button
                id="about-book-consultation-btn"
                onClick={onBookConsultation}
                className="px-7 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
              >
                Schedule Your Next Training Block
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
