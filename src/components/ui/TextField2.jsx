import clsx from "clsx";

export default function TextField({
  label,
  icon: Icon,
  trailingIcon: TrailingIcon,
  error = false,
  className,
  inputClassName,
  ...props
}) {
  return (
    <div className={className}>
      {label && (
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          {label}
        </label>
      )}

      <div
        className={clsx(
          "flex h-14 items-center rounded-xl border bg-white px-4 transition",
          error
            ? "border-red-400 ring-2 ring-red-100"
            : "border-slate-300 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100"
        )}
      >
        {Icon && <Icon size={18} className={error ? "text-red-400" : "text-slate-400"} />}

        <input
          className={clsx(
            "ml-3 h-full w-full bg-transparent text-[15px] text-slate-700 outline-none placeholder:text-slate-400",
            inputClassName
          )}
          {...props}
        />

        {TrailingIcon && (
          <TrailingIcon size={18} className={error ? "text-red-400" : "text-slate-400"} />
        )}
      </div>
    </div>
  );
}