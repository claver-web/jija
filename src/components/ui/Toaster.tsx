"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let globalToastHandler: ((message: string, type?: ToastType) => void) | null = null;

export const toast = {
  success: (msg: string) => globalToastHandler?.(msg, "success"),
  error: (msg: string) => globalToastHandler?.(msg, "error"),
  info: (msg: string) => globalToastHandler?.(msg, "info"),
};

export function Toaster() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    globalToastHandler = addToast;
    return () => {
      globalToastHandler = null;
    };
  }, [addToast]);

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-lg border text-sm font-medium shadow-2xl transition-all duration-300 animate-slide-up ${
            t.type === "success"
              ? "bg-black text-white border-neutral-700 dark:bg-white dark:text-black dark:border-neutral-200"
              : t.type === "error"
              ? "bg-neutral-900 text-red-400 border-red-900/50 dark:bg-neutral-100 dark:text-red-600 dark:border-red-300"
              : "bg-neutral-900 text-neutral-100 border-neutral-800 dark:bg-white dark:text-neutral-900 dark:border-neutral-200"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {t.type === "success" && <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 dark:text-emerald-600" />}
            {t.type === "error" && <AlertCircle className="w-4 h-4 shrink-0 text-red-400 dark:text-red-600" />}
            {t.type === "info" && <Info className="w-4 h-4 shrink-0 text-neutral-400" />}
            <span>{t.message}</span>
          </div>
          <button
            onClick={() => removeToast(t.id)}
            className="opacity-70 hover:opacity-100 transition-opacity p-0.5"
            aria-label="Dismiss toast"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
