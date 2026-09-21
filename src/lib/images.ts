/**
 * Curated high-resolution imagery for personal trainer & performance coaching.
 * All images follow high-contrast, dramatic studio lighting, safe exercise form,
 * and realistic one-on-one coaching dynamics.
 */

export interface CoachingImage {
  url: string;
  alt: string;
  credit?: string;
}

export const IMAGES = {
  hero: {
    url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1920&q=80',
    alt: 'High-performance athletic training facility with trainer guiding barbell work',
    overlay: 'Trainer demonstrating movement setup in professional studio',
  },
  trainerPortrait: {
    url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80',
    alt: 'Certified elite personal trainer coaching athlete with kettlebell technique',
  },
  trainerAction: {
    url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=80',
    alt: 'Personal coach supervising focused strength training with strict form',
  },
  coachingStudio: {
    url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80',
    alt: 'Premium clean private gym setup with free weights and functional turf',
  },
  mobility: {
    url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
    alt: 'Athlete working through active mobility and joint preparation',
  },
  assessment: {
    url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
    alt: 'Biomechanics and movement quality assessment in training studio',
  },
  smallGroup: {
    url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=1200&q=80',
    alt: 'Small group functional strength and athletic conditioning session',
  },
  conditioning: {
    url: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=1200&q=80',
    alt: 'Dynamic conditioning and energy system development',
  },
  equipmentDetail: {
    url: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1200&q=80',
    alt: 'Precision calibrated barbells, bumper plates, and kettlebells',
  }
};

// Map service names / IDs to appropriate visuals
export const getServiceImage = (serviceName: string): CoachingImage => {
  const lower = (serviceName || '').toLowerCase();
  if (lower.includes('mobility') || lower.includes('movement') || lower.includes('recovery')) {
    return {
      url: IMAGES.mobility.url,
      alt: 'Mobility and movement control session with coach',
    };
  }
  if (lower.includes('assessment') || lower.includes('evaluation') || lower.includes('biomechanic')) {
    return {
      url: IMAGES.assessment.url,
      alt: 'Comprehensive movement and fitness assessment',
    };
  }
  if (lower.includes('group') || lower.includes('semi-private') || lower.includes('duo')) {
    return {
      url: IMAGES.smallGroup.url,
      alt: 'Small group strength and conditioning session',
    };
  }
  if (lower.includes('condition') || lower.includes('hiit') || lower.includes('endurance') || lower.includes('energy')) {
    return {
      url: IMAGES.conditioning.url,
      alt: 'High-intensity athletic conditioning session',
    };
  }
  if (lower.includes('strength') || lower.includes('hypertrophy') || lower.includes('power')) {
    return {
      url: IMAGES.equipmentDetail.url,
      alt: 'Barbell strength and progressive overload coaching',
    };
  }
  // Default to one-on-one personal coaching
  return {
    url: IMAGES.trainerAction.url,
    alt: '1-on-1 personalized coaching and technique mastery',
  };
};
