import React, { useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  Dumbbell,
  Clock,
  CalendarOff,
  Settings,
  LogOut,
  ExternalLink,
  Shield,
  Menu,
  X,
  Database,
} from 'lucide-react';
import {
  Appointment,
  Service,
  BusinessHours,
  BlockedDate,
  TrainerSettings,
  AppointmentStatus,
} from '../../types';
import { OverviewTab } from './OverviewTab';
import { AppointmentsTab } from './AppointmentsTab';
import { ServicesTab } from './ServicesTab';
import { BusinessHoursTab } from './BusinessHoursTab';
import { BlockedDatesTab } from './BlockedDatesTab';
import { TrainerSettingsTab } from './TrainerSettingsTab';
import { DatabaseSetupModal } from './DatabaseSetupModal';

interface AdminLayoutProps {
  currentUser: any;
  appointments: Appointment[];
  services: Service[];
  businessHours: BusinessHours[];
  blockedDates: BlockedDate[];
  trainerSettings: TrainerSettings | null;
  loading: boolean;
  onSignOut: () => void;
  onBackToSite: () => void;
  onUpdateAppointmentStatus: (id: string, status: AppointmentStatus) => Promise<void>;
  onAddService: (serviceData: {
    name: string;
    description: string;
    duration_minutes: number;
    price: number;
    is_active: boolean;
  }) => Promise<void>;
  onUpdateService: (
    id: string,
    updates: Partial<Omit<Service, 'id' | 'created_at'>>
  ) => Promise<void>;
  onSaveBusinessHours: (hours: BusinessHours[]) => Promise<void>;
  onAddBlockedDate: (date: string, reason: string) => Promise<void>;
  onDeleteBlockedDate: (id: string) => Promise<void>;
  onSaveTrainerSettings: (
    updates: Partial<Omit<TrainerSettings, 'id' | 'created_at'>>
  ) => Promise<void>;
}

type TabType = 'overview' | 'appointments' | 'services' | 'hours' | 'blocked' | 'settings';

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentUser,
  appointments,
  services,
  businessHours,
  blockedDates,
  trainerSettings,
  loading,
  onSignOut,
  onBackToSite,
  onUpdateAppointmentStatus,
  onAddService,
  onUpdateService,
  onSaveBusinessHours,
  onAddBlockedDate,
  onDeleteBlockedDate,
  onSaveTrainerSettings,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showDbModal, setShowDbModal] = useState(false);

  const pendingAppointmentsCount = appointments.filter((a) => a.status === 'pending').length;

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    {
      id: 'appointments',
      label: 'Appointments',
      icon: Calendar,
      badge: pendingAppointmentsCount > 0 ? pendingAppointmentsCount : null,
    },
    { id: 'services', label: 'Services', icon: Dumbbell },
    { id: 'hours', label: 'Business Hours', icon: Clock },
    { id: 'blocked', label: 'Blocked Dates', icon: CalendarOff },
    { id: 'settings', label: 'Trainer Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#07090d] text-gray-200 flex flex-col md:flex-row">
      {/* Mobile Topbar */}
      <div className="md:hidden bg-[#0a0d14] border-b border-white/10 px-4 py-3 flex items-center justify-between z-40 sticky top-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Shield className="w-4 h-4" />
          </div>
          <span className="font-bold text-white text-sm">Coach Dashboard</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDbModal(true)}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white text-xs"
            title="Database Schema"
          >
            <Database className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0a0d14] border-r border-white/10 flex flex-col justify-between transition-transform duration-300 md:static md:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-left">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-[#090b10] rounded-[10px] flex items-center justify-center">
                  <Shield className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
              <div>
                <span className="block text-sm font-black text-white uppercase font-mono tracking-wider">
                  Apex Control
                </span>
                <span className="block text-[10px] text-emerald-400 font-semibold tracking-wider uppercase">
                  Admin Workspace
                </span>
              </div>
            </div>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden p-1 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-left">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`admin-tab-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id as TabType);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                    isActive
                      ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/10 font-bold'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-black ${
                        isActive
                          ? 'bg-slate-950 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="p-4 border-t border-white/10 space-y-2 text-left">
          <button
            onClick={() => setShowDbModal(true)}
            className="w-full px-3 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-emerald-400 hover:bg-white/5 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Supabase Schema / SQL</span>
          </button>

          <button
            onClick={onBackToSite}
            className="w-full px-3 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              <span>Public Website</span>
            </div>
            <span className="text-[10px] font-mono text-gray-500">Live</span>
          </button>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between">
            <div className="truncate text-[11px] text-gray-400 max-w-[130px]" title={currentUser?.email}>
              {currentUser?.email || 'Admin Coach'}
            </div>
            <button
              id="btn-admin-signout"
              onClick={onSignOut}
              className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          {activeTab === 'overview' && (
            <OverviewTab
              appointments={appointments}
              services={services}
              trainerSettings={trainerSettings}
              onNavigateToTab={(tab) => setActiveTab(tab as TabType)}
              onUpdateStatus={onUpdateAppointmentStatus}
            />
          )}

          {activeTab === 'appointments' && (
            <AppointmentsTab
              appointments={appointments}
              loading={loading}
              onUpdateStatus={onUpdateAppointmentStatus}
            />
          )}

          {activeTab === 'services' && (
            <ServicesTab
              services={services}
              loading={loading}
              onAddService={onAddService}
              onUpdateService={onUpdateService}
            />
          )}

          {activeTab === 'hours' && (
            <BusinessHoursTab
              businessHours={businessHours}
              loading={loading}
              onSaveHours={onSaveBusinessHours}
            />
          )}

          {activeTab === 'blocked' && (
            <BlockedDatesTab
              blockedDates={blockedDates}
              loading={loading}
              onAddBlockedDate={onAddBlockedDate}
              onDeleteBlockedDate={onDeleteBlockedDate}
            />
          )}

          {activeTab === 'settings' && (
            <TrainerSettingsTab
              trainerSettings={trainerSettings}
              loading={loading}
              onSaveSettings={onSaveTrainerSettings}
            />
          )}
        </div>
      </main>

      {/* SQL Setup Modal */}
      {showDbModal && <DatabaseSetupModal onClose={() => setShowDbModal(false)} />}
    </div>
  );
};
