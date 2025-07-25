import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);

    const timer = setTimeout(() => {
      onClose();
    }, 5000); 

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  const baseClasses =
    "fixed top-5 left-1/2 z-50 flex w-11/12 max-w-sm -translate-x-1/2 animate-fade-in-down items-center gap-4 rounded-lg border p-4 text-neutral-900 shadow-lg backdrop-blur-lg dark:text-neutral-100 sm:left-auto sm:right-5 sm:w-auto sm:translate-x-0";
  const typeClasses =
    type === "success"
      ? "bg-sky-400/30 border-sky-500/40"
      : "bg-red-400/30 border-red-500/40";

  const toastContent = (
    <div className={`${baseClasses} ${typeClasses}`}>
      <span>{message}</span>
      <button
        onClick={onClose}
        className="text-xl font-bold leading-none opacity-80 hover:opacity-100"
      >
        &times;
      </button>
    </div>
  );

  if (isBrowser) {
    return createPortal(toastContent, document.body);
  }

  return null; 
}