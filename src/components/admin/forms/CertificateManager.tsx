"use client";

import React, { useState } from "react";
import Image from "next/image";
import { saveCertificate, deleteCertificate } from "@/lib/actions/content";
import { toast } from "@/components/ui/Toaster";
import { Plus, Edit2, Trash2, X, Check, Loader2, Award, Upload, ExternalLink, FileText } from "lucide-react";

function isImageFormat(url: string | null | undefined): boolean {
  if (!url) return false;
  if (/\.pdf($|\?)/i.test(url)) return false;
  return /\.(png|jpe?g|webp|gif|svg|avif)($|\?)/i.test(url) || url.startsWith("data:image/");
}

interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  issueDate: Date;
  credentialUrl: string | null;
  imageUrl: string | null;
  order: number;
}

export function CertificateManager({ initialItems }: { initialItems: CertificateItem[] }) {
  const [items, setItems] = useState<CertificateItem[]>(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CertificateItem | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [credentialUrl, setCredentialUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [order, setOrder] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const openAdd = () => {
    setEditingItem(null);
    setTitle("");
    setIssuer("");
    setIssueDate(new Date().toISOString().split("T")[0]);
    setCredentialUrl("");
    setImageUrl("");
    setOrder(items.length + 1);
    setIsModalOpen(true);
  };

  const openEdit = (cert: CertificateItem) => {
    setEditingItem(cert);
    setTitle(cert.title);
    setIssuer(cert.issuer);
    setIssueDate(new Date(cert.issueDate).toISOString().split("T")[0]);
    setCredentialUrl(cert.credentialUrl || "");
    setImageUrl(cert.imageUrl || "");
    setOrder(cert.order);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setImageUrl(data.url);
      toast.success("Certificate image uploaded!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !issuer || !issueDate) {
      toast.error("Please fill in Title, Issuer, and Issue Date.");
      return;
    }

    setIsSaving(true);
    try {
      await saveCertificate({
        id: editingItem?.id,
        title,
        issuer,
        issueDate,
        credentialUrl: credentialUrl || null,
        imageUrl: imageUrl || null,
        order: Number(order) || 0,
      });

      toast.success(editingItem ? "Certificate updated!" : "Certificate added!");
      setIsModalOpen(false);
      window.location.reload();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save certificate.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete certificate "${name}"?`)) return;
    try {
      await deleteCertificate(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("Certificate deleted.");
    } catch {
      toast.error("Failed to delete certificate.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Certifications & Credentials
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Display professional cloud certifications, machine learning accreditations, and badges.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black text-xs font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          <span>Add Certificate</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.length === 0 ? (
          <div className="lg:col-span-3 p-16 text-center border border-dashed border-neutral-300 dark:border-neutral-800 rounded-xl text-neutral-500 text-sm">
            No certificates added yet.
          </div>
        ) : (
          items.map((cert) => (
            <div
              key={cert.id}
              className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex flex-col justify-between hover:border-neutral-400 dark:hover:border-neutral-700 transition-colors"
            >
              <div>
                {cert.imageUrl ? (
                  isImageFormat(cert.imageUrl) ? (
                    <div className="relative w-full h-36 mb-4 rounded-lg overflow-hidden border border-neutral-100 dark:border-neutral-800">
                      <Image src={cert.imageUrl} alt={cert.title} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-full h-36 mb-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex flex-col items-center justify-center gap-1.5 p-3 text-center">
                      <FileText className="w-6 h-6 text-red-500" />
                      <span className="text-[11px] font-mono text-neutral-600 dark:text-neutral-400 font-medium">PDF Certificate</span>
                      <a href={cert.imageUrl} target="_blank" rel="noreferrer" className="text-[10px] font-mono underline text-neutral-500 hover:text-black dark:hover:text-white">View File</a>
                    </div>
                  )
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-neutral-600 dark:text-neutral-400 mb-4">
                    <Award className="w-5 h-5" />
                  </div>
                )}

                <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1">
                  {cert.title}
                </h3>
                <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                  {cert.issuer}
                </p>
                <p className="text-xs font-mono text-neutral-400 mt-2">
                  Issued:{" "}
                  {new Date(cert.issueDate).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                {cert.credentialUrl ? (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-mono text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                  >
                    <span>Verify</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span />
                )}

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEdit(cert)}
                    className="p-1.5 rounded-md text-neutral-500 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cert.id, cert.title)}
                    className="p-1.5 rounded-md text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-6 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800 mb-5">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                {editingItem ? "Edit Certificate" : "Add Certificate"}
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
                  Certificate Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. AWS Certified Solutions Architect"
                  required
                  className="w-full px-3.5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500 mb-1">
                  Issuer Organization *
                </label>
                <input
                  type="text"
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                  placeholder="e.g. Amazon Web Services, DeepLearning.AI"
                  required
                  className="w-full px-3.5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500 mb-1">
                    Issue Date *
                  </label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
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
                  Credential Verification URL
                </label>
                <input
                  type="url"
                  value={credentialUrl}
                  onChange={(e) => setCredentialUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500 mb-1">
                  Certificate Image
                </label>
                {imageUrl && (
                  isImageFormat(imageUrl) ? (
                    <div className="relative w-full h-32 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 mb-2">
                      <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-full h-20 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex items-center gap-3 p-3 mb-2">
                      <FileText className="w-7 h-7 text-red-500 shrink-0" />
                      <div className="overflow-hidden">
                        <p className="text-xs font-mono font-medium text-neutral-800 dark:text-neutral-200 truncate">
                          {imageUrl.split("/").pop()}
                        </p>
                        <span className="text-[10px] text-neutral-500 font-mono">PDF Document Attached</span>
                      </div>
                    </div>
                  )
                )}
                <label className="cursor-pointer flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-xs font-medium text-neutral-600 dark:text-neutral-400">
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  <span>{isUploading ? "Uploading..." : "Upload Certificate Image / PDF"}</span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </label>
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
                  <span>Save Certificate</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CertificateManager;
