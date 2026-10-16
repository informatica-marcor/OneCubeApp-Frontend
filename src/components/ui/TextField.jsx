export default function TextField({
  label,
  id,
  placeholder,
  value,
  onChange,
  type = "text",
  name,
}) {
  return (
    <div className="-space-y-0.5">
      <label
        htmlFor={id}
        className="block text-lg font-semibold text-slate-800"
      >
        {label}
      </label>

      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
      />
    </div>
  );
}