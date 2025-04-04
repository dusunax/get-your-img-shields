"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const toastVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const typeStyles = {
  success: "bg-success text-white",
  error: "bg-error text-white",
  info: "bg-primary text-white",
  warning: "bg-warning text-black",
};

interface ToastProps {
  title: string;
  message?: string;
  type?: "success" | "error" | "info" | "warning";
  duration?: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Toast = ({
  title,
  message,
  type = "info",
  duration = 1500,
  isOpen,
  setIsOpen,
}: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(false), duration);
    return () => clearTimeout(timer);
  }, [duration, isOpen, setIsOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`fixed bottom-5 right-5 flex items-center gap-3 p-4 rounded-lg shadow-lg ${typeStyles[type]}`}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={toastVariants}
        >
          <div>
            <h4 className="font-semibold">{title}</h4>
            {message && <p className="text-sm">{message}</p>}
          </div>
          <button onClick={() => setIsOpen(false)}>
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
