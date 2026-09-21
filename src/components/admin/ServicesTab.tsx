import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Clock,
  DollarSign,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  X,
  Dumbbell,
  Check,
} from 'lucide-react';
import { Service } from '../../types';

interface ServicesTabProps {
  services: Service[];
  loading: boolean;
  onAddService: (service: {
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
}

export const ServicesTab: React.FC<ServicesTabProps> = ({
  services,
  loading,
  onAddService,
  onUpdateService,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [price, setPrice] = useState(140);
  const [isActive, setIsActive] = useState(true);

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const openAddModal = () => {
    setEditingService(null);
    setName('');
    setDescription('');
    setDurationMinutes(60);
    setPrice(140);
    setIsActive(true);
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setName(service.name);
    setDescription(service.description);
    setDurationMinutes(service.duration_minutes);
    setPrice(Number(service.price));
    setIsActive(service.is_active);
    setFormError(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('Please enter a service name.');
      return;
    }
    if (!description.trim()) {
      setFormError('Please enter a service description.');
      return;
    }
    if (durationMinutes <= 0) {
      setFormError('Duration must be greater than 0 minutes.');
      return;
    }
    if (price < 0) {
      setFormError('Price cannot be negative.');
      return;
    }

    setSaving(true);
    try {
      if (editingService) {
        await onUpdateService(editingService.id, {
          name: name.trim(),
          description: description.trim(),
          duration_minutes: Number(durationMinutes),
          price: Number(price),
          is_active: isActive,
        });
      } else {
        await onAddService({
          name: name.trim(),
          description: description.trim(),
          duration_minutes: Number(durationMinutes),
          price: Number(price),
          is_active: isActive,
        });
      }
      setModalOpen(false);
    } catch (err: any) {
      console.error('Error saving service:', err);
      setFormError(err?.message || 'Failed to save service.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (service: Service) => {
    try {
      await onUpdateService(service.id, { is_active: !service.is_active });
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Coaching Services Management</h2>
          <p className="text-xs text-gray-400">
            Create, edit, and toggle active status for training programs. Inactive services remain archived.
          </p>
        </div>
        <button
          id="btn-add-new-service"
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services List */}
      <div className="bg-[#0c1017] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-xs animate-pulse">
            Loading services...
          </div>
        ) : services.length === 0 ? (
          <div className="p-12 text-center text-gray-400 space-y-3">
            <Dumbbell className="w-8 h-8 text-gray-600 mx-auto" />
            <p className="text-sm text-gray-300 font-medium">No coaching services found.</p>
            <button
              onClick={openAddModal}
              className="px-4 py-2 rounded-lg text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300"
            >
              Create Your First Service
            </button>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {services.map((service) => (
              <div
                key={service.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="space-y-1.5 flex-1 max-w-2xl">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-bold text-white">{service.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase ${
                        service.is_active
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-gray-500/20 text-gray-400 border border-white/10'
                      }`}
                    >
                      {service.is_active ? 'Active / Visible' : 'Archived / Inactive'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed font-normal">
                    {service.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs font-mono text-gray-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      {service.duration_minutes} minutes
                    </span>
                    <span>•</span>
                    <span className="font-bold text-white font-mono">
                      ${Number(service.price).toFixed(2)} USD
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggleActive(service)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      service.is_active
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                        : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                    }`}
                  >
                    {service.is_active ? 'Deactivate' : 'Activate'}
                  </button>

                  <button
                    id={`btn-edit-service-${service.id}`}
                    onClick={() => openEditModal(service)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/15 border border-white/10 text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit / Add Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg my-8 rounded-3xl bg-[#0c1017] border border-white/15 shadow-2xl p-6 sm:p-8 text-left space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-xl font-bold text-white">
                {editingService ? 'Edit Coaching Service' : 'Add New Coaching Service'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-gray-300">
                  Service Name *
                </label>
                <input
                  id="service-name-input"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. 1-on-1 Personal Training Session"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-gray-300">
                  Description *
                </label>
                <textarea
                  id="service-description-input"
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe session structure, target audience, and training focus..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-emerald-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-gray-300">
                    Duration (Minutes) *
                  </label>
                  <input
                    id="service-duration-input"
                    type="number"
                    min={15}
                    step={5}
                    required
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-gray-300">
                    Price (USD $) *
                  </label>
                  <input
                    id="service-price-input"
                    type="number"
                    min={0}
                    step={1}
                    required
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <input
                  id="service-active-toggle"
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 accent-emerald-400 rounded cursor-pointer"
                />
                <label htmlFor="service-active-toggle" className="text-xs text-gray-300 cursor-pointer">
                  Active (visible on public booking page)
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="btn-save-service"
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingService ? 'Update Service' : 'Create Service'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
