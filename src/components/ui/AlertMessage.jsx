import clsx from "clsx";
import { CircleAlert, CheckCircle2, Info } from "lucide-react";

const icons = {
  error: CircleAlert,
  success: CheckCircle2,
  info: Info,
};

const styles = {
  error: "border-red-200 bg-red-50 text-red-500",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  info: "border-slate-200 bg-slate-50 text-slate-600",
};

export default function AlertMessage({ variant = "info", children, className }) {
  const Icon = icons[variant];

  return (
    <div
      className={clsx(
        "flex items-start gap-2 rounded-xl border px-4 py-3 text-sm",
        styles[variant],
        className
      )}
    >
      <Icon size={16} className="mt-0.5 shrink-0" />
      <div>{children}</div>
    </div>
  );
}