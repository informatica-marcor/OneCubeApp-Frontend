import { CheckCircle, XCircle, LoaderCircle } from "lucide-react";

const VARIANT_STYLES = {
  success: {
    icon: CheckCircle,
    iconClassName: "text-emerald-500",
    titleClassName: "text-emerald-500",
    buttonClassName: "bg-emerald-500 text-white hover:bg-emerald-600",
    defaultButtonLabel: "Listo",
  },
  error: {
    icon: XCircle,
    iconClassName: "text-rose-500",
    titleClassName: "text-rose-500",
    buttonClassName: "bg-rose-500 text-white hover:bg-rose-600",
    defaultButtonLabel: "Cerrar",
  },
};

export default function ActionStatusModal({
  open,
  status = "loading", // loading | success | error
  message = "Cargando",
  buttonLabel,
  onClose,
  closeOnBackdrop = false,
}) {
  if (!open) return null;

  const isLoading = status === "loading";

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
        <LoaderCircle className="h-14 w-14 animate-spin text-white" />
      </div>
    );
  }

  const config = VARIANT_STYLES[status] ?? VARIANT_STYLES.error;
  const Icon = config.icon;
  const resolvedButtonLabel = buttonLabel ?? config.defaultButtonLabel;

  const handleBackdropClick = () => {
    if (closeOnBackdrop) {
      onClose?.();
    }
  };

  const handlePanelClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]"
      onClick={handleBackdropClick}
    >
      <div
        onClick={handlePanelClick}
        className="w-full max-w-[640px] rounded-[18px] bg-white px-5 py-6 shadow-[0_24px_64px_rgba(15,23,42,0.24)] sm:px-8 sm:py-8"
      >
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center gap-4">
            <Icon
              className={`h-12 w-12 sm:h-14 sm:w-14 ${config.iconClassName}`}
            />

            <h2
              className={`text-3xl font-semibold leading-none ${config.titleClassName}`}
            >
              {message}
            </h2>
          </div>

          <div className="mt-7 w-full">
            <button
              type="button"
              onClick={onClose}
              className={`h-[44px] w-full rounded-xl text-xl font-semibold transition ${config.buttonClassName}`}
            >
              {resolvedButtonLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}