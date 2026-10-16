import { X } from "lucide-react";

export function Modal({ open, onClose, title, children, maxWidth = "max-w-3xl" }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        className={`relative w-full ${maxWidth} rounded-xl bg-white shadow-2xl`}
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-slate-500 hover:bg-slate-100"
          aria-label="Cerrar modal"
        >
          <X size={20} />
        </button>

        <div className="px-8 pb-8 pt-6">
          {title && (
            <div className="mb-8 text-center">
              <h2 className="text-4xl font-bold tracking-tight text-slate-900">
                {title}
              </h2>
            </div>
          )}

          {children}
        </div>
      </div>
    </div>
  );
}