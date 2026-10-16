export default function FormField({ label, children, error, icon }) {
  return (
    <div>
      <label className="mb-2 block text-base font-semibold text-slate-400 uppercase">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}