import clsx from "clsx";

export default function Button({
  children,
  className,
  variant = "primary",
  size = "lg",
  fullWidth = true,
  leftIcon = null,
  rightIcon = null,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60";

  const variants = {
    primary:
      "bg-[#4BAE52] text-white shadow-[0_10px_24px_rgba(6,214,79,0.28)] hover:brightness-95",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  const sizes = {
    md: "h-11 px-4 text-sm",
    lg: "h-14 px-6 text-lg",
  };

  return (
    <button
      className={clsx(
        base,
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
}