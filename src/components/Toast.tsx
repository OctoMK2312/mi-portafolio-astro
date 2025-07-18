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
    "fixed top-5 right-5 z-50 flex animate-fade-in-down items-center gap-4 rounded-lg border p-4 text-neutral-900 shadow-lg backdrop-blur-lg dark:text-neutral-100";
  const typeClasses =
    type === "success"
      ? "bg-green-400/30 border-green-500/40"
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