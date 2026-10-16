import { CalendarDays } from "lucide-react";

export default function DateTimeField({
  label,
  id,
  value,
  onChange,
  name,
  min,
}) {
  return (
    <div className="-space-y-0.5">
      <label
        htmlFor={id}
        className="block text-lg font-semibold text-slate-800"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          name={name}
          type="datetime-local"
          value={value}
          onChange={onChange}
          min={min}
          className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 pr-12 text-base text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
        />

        <CalendarDays
          size={20}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
        />
      </div>
    </div>
  );
}