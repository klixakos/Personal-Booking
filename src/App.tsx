import React, { useState, useEffect, useCallback } from 'react';
import {
  Service,
  BusinessHours,
  BlockedDate,
  TrainerSettings,
  Appointment,
  AppointmentStatus,
} from './types';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import {
  fetchActiveServices,
  fetchAllServices,
  fetchBusinessHours,
  fetchBlockedDates,
  fetchTrainerSettings,
  fetchAllAppointments,
  checkIsAdmin,
  createAppointment,
  updateAppointmentStatus,
  createService,
  updateService,
  saveBusinessHours,
  createBlockedDate,
  deleteBlockedDate,
  updateTrainerSettings,
} from './lib/api';

// Public Components
import { Navbar } from './components/public/Navbar';
import { Hero } from './components/public/Hero';
import { ServicesSection } from './components/public/ServicesSection';
import { AboutSection } from './components/public/AboutSection';
import { BookingSection } from './components/public/BookingSection';
import { Footer } from './components/public/Footer';

// Admin Components
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';
import { DatabaseSetupModal } from './components/admin/DatabaseSetupModal';
import { Shield, Loader2 } from 'lucide-react';

export default function App() {
  // Navigation View State
  const [currentView, setCurrentView] = useState<'public' | 'admin_login' | 'admin_dashboard'>('public');

  // Authentication State
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  // Core Data State
  const [services, setServices] = useState<Service[]>([]);
  const [businessHours, setBusinessHours] = useState<BusinessHours[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [trainerSettings, setTrainerSettings] = useState<TrainerSettings | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<Service | null>(null);

  // Setup Modal State
  const [showDbModal, setShowDbModal] = useState(false);

  // Check URL hash on initial load
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#admin' || hash === '#dashboard') {
        if (isAdmin) {
          setCurrentView('admin_dashboard');
        } else if (!authChecking) {
          setCurrentView('admin_login');
        }
      } else if (hash === '#login') {
        setCurrentView('admin_login');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [isAdmin, authChecking]);

  // Check initial Supabase session & admin privileges
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      setAuthChecking(true);
      try {
        if (!isSupabaseConfigured) {
          if (isMounted) {
            setCurrentUser(null);
            setIsAdmin(false);
            setAuthChecking(false);
          }
          return;
        }

        const { data } = await supabase.auth.getSession();
        const user = data.session?.user || null;

        if (user && isMounted) {
          setCurrentUser(user);
          // Check if user.id is in admin_users
          const isUserAdmin = await checkIsAdmin(user.id);
          if (isMounted) {
            setIsAdmin(isUserAdmin);
            if (isUserAdmin && (window.location.hash === '#admin' || window.location.hash === '#dashboard')) {
              setCurrentView('admin_dashboard');
            }
          }
        } else if (isMounted) {
          setCurrentUser(null);
          setIsAdmin(false);
        }
      } catch (err) {
        console.error('Session initialization error:', err);
      } finally {
        if (isMounted) {
          setAuthChecking(false);
        }
      }
    };

    initAuth();

    // Listen to Auth State changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      const user = session?.user || null;
      if (user) {
        setCurrentUser(user);
        const adminStatus = await checkIsAdmin(user.id);
        setIsAdmin(adminStatus);
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
        if (currentView === 'admin_dashboard') {
          setCurrentView('public');
          window.location.hash = '';
        }
      }
    });

    return () => {
      isMounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Load public and trainer data
  const loadData = useCallback(async () => {
    setDataLoading(true);
    try {
      const [servicesData, hoursData, blockedData, settingsData] = await Promise.all([
        isAdmin ? fetchAllServices() : fetchActiveServices(),
        fetchBusinessHours(),
        fetchBlockedDates(),
        fetchTrainerSettings(),
      ]);

      setServices(servicesData);
      setBusinessHours(hoursData);
      setBlockedDates(blockedData);
      setTrainerSettings(settingsData);

      // If admin, also fetch full appointments list
      if (isAdmin) {
        const appts = await fetchAllAppointments();
        setAppointments(appts);
      }
    } catch (err) {
      console.error('Error loading database data:', err);
    } finally {
      setDataLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // When view changes to admin_dashboard, ensure full services and appointments are loaded
  useEffect(() => {
    if (currentView === 'admin_dashboard' && isAdmin) {
      fetchAllAppointments().then(setAppointments);
      fetchAllServices().then(setServices);
    }
  }, [currentView, isAdmin]);

  // Navigation handlers
  const handleOpenAdmin = () => {
    if (isAdmin && currentUser) {
      setCurrentView('admin_dashboard');
      window.location.hash = '#admin';
    } else {
      setCurrentView('admin_login');
      window.location.hash = '#login';
    }
  };

  const handleBackToPublic = () => {
    setCurrentView('public');
    window.location.hash = '';
  };

  const handleLoginSuccess = (user: any) => {
    setCurrentUser(user);
    setIsAdmin(true);
    setCurrentView('admin_dashboard');
    window.location.hash = '#admin';
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setIsAdmin(false);
    setCurrentView('public');
    window.location.hash = '';
  };

  const scrollToBooking = () => {
    if (currentView !== 'public') {
      setCurrentView('public');
      window.location.hash = '';
      setTimeout(() => {
        const el = document.getElementById('booking');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('booking');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Booking action from client side
  const handleCreateAppointment = async (bookingData: {
    service_id: string;
    appointment_date: string;
    start_time: string;
    end_time: string;
    full_name: string;
    email: string;
    phone: string;
    notes?: string;
  }) => {
    const newAppt = await createAppointment(bookingData);
    // Refresh appointments
    setAppointments((prev) => [newAppt, ...prev]);
    return newAppt;
  };

  // Admin Actions
  const handleUpdateAppointmentStatus = async (id: string, status: AppointmentStatus) => {
    const updated = await updateAppointmentStatus(id, status);
    setAppointments((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: updated.status } : item))
    );
  };

  const handleAddService = async (serviceData: {
    name: string;
    description: string;
    duration_minutes: number;
    price: number;
    is_active: boolean;
  }) => {
    const created = await createService(serviceData);
    setServices((prev) => [...prev, created]);
  };

  const handleUpdateService = async (
    id: string,
    updates: Partial<Omit<Service, 'id' | 'created_at'>>
  ) => {
    const updated = await updateService(id, updates);
    setServices((prev) => prev.map((s) => (s.id === id ? updated : s)));
  };

  const handleSaveBusinessHours = async (hours: BusinessHours[]) => {
    const updated = await saveBusinessHours(hours);
    setBusinessHours(updated);
  };

  const handleAddBlockedDate = async (date: string, reason: string) => {
    const created = await createBlockedDate(date, reason);
    setBlockedDates((prev) => [...prev, created]);
  };

  const handleDeleteBlockedDate = async (id: string) => {
    await deleteBlockedDate(id);
    setBlockedDates((prev) => prev.filter((b) => b.id !== id));
  };

  const handleSaveTrainerSettings = async (
    updates: Partial<Omit<TrainerSettings, 'id' | 'created_at'>>
  ) => {
    const updated = await updateTrainerSettings(updates);
    setTrainerSettings(updated);
  };

  // If currently checking authentication and user tried accessing admin
  if (authChecking && currentView === 'admin_dashboard') {
    return (
      <div className="min-h-screen bg-[#07090d] flex items-center justify-center p-4 text-white">
        <div className="flex flex-col items-center gap-3 text-center">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
          <div className="text-sm font-semibold">Verifying Coach Access Privileges...</div>
          <div className="text-xs text-gray-500 font-mono">Querying admin_users table</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090d] text-gray-100 font-sans selection:bg-emerald-400 selection:text-slate-950">
      {/* 1. Admin Login View */}
      {currentView === 'admin_login' && (
        <AdminLogin
          onBackToSite={handleBackToPublic}
          onLoginSuccess={handleLoginSuccess}
          onOpenSetupModal={() => setShowDbModal(true)}
        />
      )}

      {/* 2. Admin Dashboard View (Protected) */}
      {currentView === 'admin_dashboard' && (
        <>
          {isAdmin ? (
            <AdminLayout
              currentUser={currentUser}
              appointments={appointments}
              services={services}
              businessHours={businessHours}
              blockedDates={blockedDates}
              trainerSettings={trainerSettings}
              loading={dataLoading}
              onSignOut={handleSignOut}
              onBackToSite={handleBackToPublic}
              onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
              onAddService={handleAddService}
              onUpdateService={handleUpdateService}
              onSaveBusinessHours={handleSaveBusinessHours}
              onAddBlockedDate={handleAddBlockedDate}
              onDeleteBlockedDate={handleDeleteBlockedDate}
              onSaveTrainerSettings={handleSaveTrainerSettings}
            />
          ) : (
            <div className="min-h-screen flex items-center justify-center p-4">
              <div className="max-w-md w-full p-8 rounded-3xl bg-[#0c1017] border border-white/10 text-center space-y-4">
                <Shield className="w-12 h-12 text-rose-400 mx-auto" />
                <h2 className="text-xl font-bold text-white">Access Denied</h2>
                <p className="text-xs text-gray-400">
                  You are signed in, but you are not authorized as an admin in the admin_users table.
                </p>
                <button
                  onClick={handleBackToPublic}
                  className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white"
                >
                  Return to Website
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* 3. Public Website View */}
      {currentView === 'public' && (
        <div className="relative">
          {/* Top Navbar */}
          <Navbar
            trainerSettings={trainerSettings}
            isAdmin={isAdmin}
            onOpenAdmin={handleOpenAdmin}
            onNavigateToBooking={scrollToBooking}
          />

          {/* Hero Section */}
          <Hero
            trainerSettings={trainerSettings}
            onBookNow={scrollToBooking}
            onViewServices={() => {
              const el = document.getElementById('services');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* Coaching Services Section */}
          <ServicesSection
            services={services.filter((s) => s.is_active)}
            loading={dataLoading}
            onSelectService={(svc) => {
              setSelectedServiceForBooking(svc);
              scrollToBooking();
            }}
          />

          {/* Coach Bio & Methodology */}
          <AboutSection
            trainerSettings={trainerSettings}
            onBookConsultation={scrollToBooking}
          />

          {/* Live Booking Wizard */}
          <BookingSection
            services={services.filter((s) => s.is_active)}
            businessHours={businessHours}
            blockedDates={blockedDates}
            trainerSettings={trainerSettings}
            appointments={appointments}
            preselectedService={selectedServiceForBooking}
            onBookingCreated={(newAppt) => {
              setAppointments((prev) => [newAppt, ...prev]);
            }}
          />

          {/* Footer */}
          <Footer
            trainerSettings={trainerSettings}
            businessHours={businessHours}
            onOpenAdmin={handleOpenAdmin}
            onNavigateToBooking={scrollToBooking}
          />
        </div>
      )}

      {/* Global Supabase Setup Modal */}
      {showDbModal && <DatabaseSetupModal onClose={() => setShowDbModal(false)} />}
    </div>
  );
}
