"use client";

import React, { useState } from "react";
import { saveExperience, deleteExperience } from "@/lib/actions/content";
import { toast } from "@/components/ui/Toaster";
import { Plus, Edit2, Trash2, X, Check, Loader2, Calendar, MapPin, Building2 } from "lucide-react";

interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  description: string;
  startDate: Date;
  endDate: Date | null;
  current: boolean;
  location: string | null;
  order: number;
}

export function ExperienceManager({ initialItems }: { initialItems: ExperienceItem[] }) {
  const [items, setItems] = useState<ExperienceItem[]>(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ExperienceItem | null>(null);

  // Form state
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [current, setCurrent] = useState(false);
  const [location, setLocation] = useState("");
  const [order, setOrder] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const openAdd = () => {
    setEditingItem(null);
    setCompany("");
    setRole("");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setCurrent(false);
    setLocation("");
    setOrder(items.length + 1);
    setIsModalOpen(true);
  };

  const openEdit = (exp: ExperienceItem) => {
    setEditingItem(exp);
    setCompany(exp.company);
    setRole(exp.role);
    setDescription(exp.description);
    setStartDate(new Date(exp.startDate).toISOString().split("T")[0]);
    setEndDate(exp.endDate ? new Date(exp.endDate).toISOString().split("T")[0] : "");
    setCurrent(exp.current);
    setLocation(exp.location || "");
    setOrder(exp.order);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !role || !description || !startDate) {
      toast.error("Please fill in company, role, description, and start date.");
      return;
    }

    setIsSaving(true);
    try {
      await saveExperience({
        id: editingItem?.id,
        company,
        role,
        description,
        startDate,
        endDate: current ? null : endDate || null,
        current,
        location: location || null,
        order: Number(order) || 0,
      });

      toast.success(editingItem ? "Experience updated!" : "Experience added!");
      setIsModalOpen(false);
      window.location.reload();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save experience.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete experience for "${name}"?`)) return;
    try {
      await deleteExperience(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("Experience removed.");
    } catch {
      toast.error("Failed to delete experience.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Professional Experience
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Manage your career history, engineering roles, and job accomplishments.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black text-xs font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          <span>Add Position</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {items.length === 0 ? (
          <div className="p-16 text-center border border-dashed border-neutral-300 dark:border-neutral-800 rounded-xl text-neutral-500 text-sm">
            No work experience recorded. Click "Add Position" to add your roles.
          </div>
        ) : (
          items.map((exp) => (
            <div
              key={exp.id}
              className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:border-neutral-400 dark:hover:border-neutral-700 transition-colors"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                    {exp.role}
                  </h3>
                  <span className="text-neutral-400 text-sm font-medium">@</span>
                  <span className="text-neutral-700 dark:text-neutral-300 font-semibold text-sm">
                    {exp.company}
                  </span>
                  {exp.current && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 dark:text-emerald-400">
                      Current
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-500">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(exp.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })} —{" "}
                    {exp.current
                      ? "Present"
                      : exp.endDate
                      ? new Date(exp.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                      : "N/A"}
                  </span>

                  {exp.location && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {exp.location}
                    </span>
                  )}

                  <span>Order: #{exp.order}</span>
                </div>

                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed pt-2 whitespace-pre-line">
                  {exp.description}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => openEdit(exp)}
                  className="p-2 rounded-lg text-neutral-500 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(exp.id, `${exp.role} at ${exp.company}`)}
                  className="p-2 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-6 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800 mb-5">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                {editingItem ? "Edit Position" : "Add New Position"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded text-neutral-400 hover:text-black dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500 mb-1">
                    Company *
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. OpenAI / Google / Startup"
                    required
                    className="w-full px-3.5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500 mb-1">
                    Role Title *
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Senior AI Systems Engineer"
                    required
                    className="w-full px-3.5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    disabled={current}
                    className="w-full px-3.5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none disabled:opacity-40"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="currentRole"
                  checked={current}
                  onChange={(e) => setCurrent(e.target.checked)}
                  className="w-4 h-4 rounded text-black dark:text-white border-neutral-400"
                />
                <label htmlFor="currentRole" className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  I currently work here
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="San Francisco, CA / Remote"
                    className="w-full px-3.5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500 mb-1">
                    Order Priority
                  </label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500 mb-1">
                  Description & Key Achievements *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                  placeholder="Architected distributed event streaming pipeline... Reduced inference latency by 45%..."
                  className="w-full px-3.5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none resize-y"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black text-xs font-semibold hover:opacity-90 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>Save Experience</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExperienceManager;
