"use client";

import React, { useState } from "react";
import { saveQualification, deleteQualification } from "@/lib/actions/content";
import { toast } from "@/components/ui/Toaster";
import { Plus, Edit2, Trash2, X, Check, Loader2, GraduationCap } from "lucide-react";

interface QualificationItem {
  id: string;
  degree: string;
  institution: string;
  year: string;
  description: string | null;
  order: number;
}

export function QualificationManager({ initialItems }: { initialItems: QualificationItem[] }) {
  const [items, setItems] = useState<QualificationItem[]>(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<QualificationItem | null>(null);

  // Form state
  const [degree, setDegree] = useState("");
  const [institution, setInstitution] = useState("");
  const [year, setYear] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const openAdd = () => {
    setEditingItem(null);
    setDegree("");
    setInstitution("");
    setYear(new Date().getFullYear().toString());
    setDescription("");
    setOrder(items.length + 1);
    setIsModalOpen(true);
  };

  const openEdit = (q: QualificationItem) => {
    setEditingItem(q);
    setDegree(q.degree);
    setInstitution(q.institution);
    setYear(q.year);
    setDescription(q.description || "");
    setOrder(q.order);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!degree || !institution || !year) {
      toast.error("Please fill in Degree, Institution, and Year.");
      return;
    }

    setIsSaving(true);
    try {
      await saveQualification({
        id: editingItem?.id,
        degree,
        institution,
        year,
        description: description || null,
        order: Number(order) || 0,
      });

      toast.success(editingItem ? "Qualification updated!" : "Qualification added!");
      setIsModalOpen(false);
      window.location.reload();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save qualification.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await deleteQualification(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("Qualification removed.");
    } catch {
      toast.error("Failed to delete qualification.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Academic Qualifications
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Degrees, educational background, and university research honors.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black text-xs font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          <span>Add Qualification</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.length === 0 ? (
          <div className="md:col-span-2 p-16 text-center border border-dashed border-neutral-300 dark:border-neutral-800 rounded-xl text-neutral-500 text-sm">
            No academic qualifications recorded.
          </div>
        ) : (
          items.map((q) => (
            <div
              key={q.id}
              className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex flex-col justify-between hover:border-neutral-400 dark:hover:border-neutral-700 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400">
                    {q.year}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEdit(q)}
                      className="p-1.5 rounded-md text-neutral-500 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(q.id, q.degree)}
                      className="p-1.5 rounded-md text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  {q.degree}
                </h3>
                <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mt-0.5">
                  {q.institution}
                </p>

                {q.description && (
                  <p className="text-xs text-neutral-500 mt-3 leading-relaxed">
                    {q.description}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-6 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800 mb-5">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                {editingItem ? "Edit Qualification" : "Add Qualification"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded text-neutral-400 hover:text-black dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500 mb-1">
                  Degree / Major *
                </label>
                <input
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  placeholder="e.g. B.S. in Computer Science"
                  required
                  className="w-full px-3.5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500 mb-1">
                  Institution *
                </label>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. Stanford University"
                  required
                  className="w-full px-3.5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500 mb-1">
                    Graduation Year *
                  </label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="2024"
                    required
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
                  Description / Honors
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Graduated Magna Cum Laude, Thesis in Generative Multi-Agent Systems..."
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
                  <span>Save Qualification</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default QualificationManager;
