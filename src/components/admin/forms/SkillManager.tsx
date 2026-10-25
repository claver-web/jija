"use client";

import React, { useState } from "react";
import { saveSkill, deleteSkill } from "@/lib/actions/content";
import { toast } from "@/components/ui/Toaster";
import { SkillCategory } from "@prisma/client";
import { Plus, Edit2, Trash2, X, Check, Loader2, Zap } from "lucide-react";

interface SkillItem {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency: number;
  order: number;
}

const CATEGORY_OPTIONS = [
  { key: "LANGUAGE", label: "Programming Languages" },
  { key: "FRAMEWORK", label: "Frameworks & Runtimes" },
  { key: "AI_ML", label: "Agentic AI & Machine Learning" },
  { key: "DATABASE", label: "Databases & ORMs" },
  { key: "TOOL", label: "Infrastructure, DevOps & Tools" },
  { key: "OTHER", label: "Other Specialties" },
];

export function SkillManager({ initialSkills }: { initialSkills: SkillItem[] }) {
  const [skills, setSkills] = useState<SkillItem[]>(initialSkills);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SkillItem | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [category, setCategory] = useState<SkillCategory>(SkillCategory.LANGUAGE);
  const [proficiency, setProficiency] = useState(85);
  const [order, setOrder] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const openAdd = () => {
    setEditingItem(null);
    setName("");
    setCategory(SkillCategory.LANGUAGE);
    setProficiency(85);
    setOrder(skills.length + 1);
    setIsModalOpen(true);
  };

  const openEdit = (s: SkillItem) => {
    setEditingItem(s);
    setName(s.name);
    setCategory(s.category);
    setProficiency(s.proficiency);
    setOrder(s.order);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error("Skill name is required.");
      return;
    }

    setIsSaving(true);
    try {
      await saveSkill({
        id: editingItem?.id,
        name,
        category,
        proficiency: Number(proficiency),
        order: Number(order) || 0,
      });

      toast.success(editingItem ? "Skill updated!" : "Skill created!");
      setIsModalOpen(false);
      window.location.reload();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save skill.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, skillName: string) => {
    if (!confirm(`Delete skill "${skillName}"?`)) return;
    try {
      await deleteSkill(id);
      setSkills((prev) => prev.filter((s) => s.id !== id));
      toast.success("Skill deleted.");
    } catch {
      toast.error("Failed to delete skill.");
    }
  };

  // Group skills by category
  const grouped = CATEGORY_OPTIONS.map((cat) => ({
    ...cat,
    skills: skills.filter((s) => s.category === cat.key),
  })).filter((group) => group.skills.length > 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Technical Skills & Ratings
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Proficiency levels, categorizations, and homepage marquee skill entries.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black text-xs font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          <span>Add Skill</span>
        </button>
      </div>

      {skills.length === 0 ? (
        <div className="p-16 text-center border border-dashed border-neutral-300 dark:border-neutral-800 rounded-xl text-neutral-500 text-sm">
          No skills registered yet.
        </div>
      ) : (
        grouped.map((group) => (
          <div key={group.key} className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-500 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-neutral-100" />
              {group.label} ({group.skills.length})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.skills.map((skill) => (
                <div
                  key={skill.id}
                  className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex flex-col justify-between hover:border-neutral-400 dark:hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm text-neutral-900 dark:text-white">
                      {skill.name}
                    </span>
                    <span className="font-mono text-xs text-neutral-400">
                      {skill.proficiency}%
                    </span>
                  </div>

                  {/* Progress track */}
                  <div className="w-full h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-900 overflow-hidden mb-3">
                    <div
                      className="h-full bg-black dark:bg-white rounded-full"
                      style={{ width: `${skill.proficiency}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-neutral-400 pt-2 border-t border-neutral-100 dark:border-neutral-900">
                    <span className="font-mono">#{skill.order}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEdit(skill)}
                        className="p-1 rounded text-neutral-500 hover:text-black dark:hover:text-white"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(skill.id, skill.name)}
                        className="p-1 rounded text-neutral-400 hover:text-red-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-6 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800 mb-5">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                {editingItem ? "Edit Skill" : "Add Skill"}
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
                  Skill Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Next.js, LangGraph, PostgreSQL"
                  required
                  className="w-full px-3.5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500 mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as SkillCategory)}
                  className="w-full px-3.5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none"
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500">
                    Proficiency
                  </label>
                  <span className="font-mono text-xs font-semibold text-neutral-900 dark:text-white">
                    {proficiency}%
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={proficiency}
                  onChange={(e) => setProficiency(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-black dark:accent-white"
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
                  <span>Save Skill</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SkillManager;
