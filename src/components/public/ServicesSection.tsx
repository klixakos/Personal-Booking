import React from 'react';
import { Clock, ArrowRight, Check, Sparkles } from 'lucide-react';
import { Service } from '../../types';
import { getServiceImage } from '../../lib/images';

interface ServicesSectionProps {
  services: Service[];
  loading: boolean;
  onSelectService: (service: Service) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  loading,
  onSelectService,
}) => {
  return (
    <section id="services" className="py-24 bg-[#090b10] relative overflow-hidden text-left">
      {/* Background visual elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#07090d] to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wider uppercase font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            Specialized Coaching Programs
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            PRECISION SERVICES FOR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              DISCIPLINED ATHLETES.
            </span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
            Every session is structured around your body's structural mechanics, daily recovery state,
            and long-term physical goals. Select a training modality to view available session slots.
          </p>
        </div>

        {/* Dynamic Services Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-96 rounded-2xl bg-white/5 border border-white/5 animate-pulse flex flex-col justify-end p-6"
              >
                <div className="h-4 bg-white/10 rounded w-1/3 mb-3" />
                <div className="h-6 bg-white/10 rounded w-3/4 mb-2" />
                <div className="h-16 bg-white/5 rounded mb-4" />
                <div className="h-10 bg-white/10 rounded" />
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#0e1219] border border-white/10">
            <p className="text-gray-400">No active coaching services currently available for booking.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const image = getServiceImage(service.name);
              const isPopular = index === 0;

              return (
                <div
                  key={service.id}
                  id={`service-card-${service.id}`}
                  className={`group relative rounded-2xl overflow-hidden bg-[#0c1017] border transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between ${
                    isPopular
                      ? 'border-emerald-500/40 shadow-xl shadow-emerald-500/10'
                      : 'border-white/10 hover:border-white/25 shadow-xl shadow-black/40'
                  }`}
                >
                  {/* Top Image Banner */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#12161f]">
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90 contrast-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c1017] via-[#0c1017]/40 to-transparent" />

                    {/* Price & Duration Overlays */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <div className="px-3 py-1 rounded-md bg-black/75 backdrop-blur-md border border-white/15 text-xs font-mono font-semibold text-emerald-300 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{service.duration_minutes} MIN</span>
                      </div>
                      {isPopular && (
                        <div className="px-2.5 py-1 rounded-md bg-emerald-500 text-slate-950 text-[11px] font-black uppercase tracking-wider font-mono">
                          PRIMARY
                        </div>
                      )}
                    </div>

                    <div className="absolute bottom-3 right-4">
                      <div className="px-3.5 py-1.5 rounded-lg bg-[#07090d]/90 backdrop-blur-md border border-white/10 text-right">
                        <span className="text-xl font-black text-white font-mono">
                          ${Number(service.price).toFixed(0)}
                        </span>
                        <span className="text-[11px] text-gray-400 ml-1 font-medium">/ session</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-emerald-300 transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-sm text-gray-300 leading-relaxed font-normal">
                        {service.description}
                      </p>
                    </div>

                    {/* Session Inclusions Feature Checklist */}
                    <div className="pt-4 border-t border-white/5 space-y-2 text-xs text-gray-400">
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Dedicated 1-on-1 coach supervision</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Biomechanical feedback & movement notes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Warm-up & targeted recovery protocol</span>
                      </div>
                    </div>

                    {/* Booking CTA Button */}
                    <div className="pt-2">
                      <button
                        id={`btn-select-service-${service.id}`}
                        onClick={() => onSelectService(service)}
                        className="w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-white/10 hover:bg-emerald-400 hover:text-slate-950 border border-white/15 hover:border-emerald-400 transition-all duration-200 flex items-center justify-center gap-2 group-hover:bg-emerald-400 group-hover:text-slate-950 cursor-pointer"
                      >
                        <span>Book This Session</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
