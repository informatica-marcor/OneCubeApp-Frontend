import clsx from "clsx";

export default function Button({
  children,
  variant = "primary",
  type = "button",
  className,
  ...props
}) {
  const variants = {
    primary:
      "bg-emerald-500 hover:bg-emerald-600 text-white border border-emerald-500",
    secondary:
      "bg-white hover:bg-slate-50 text-slate-600 border border-slate-300",
    ghost:
      "bg-transparent hover:bg-slate-100 text-slate-700 border border-transparent",
  };

  return (
    <button
      type={type}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}