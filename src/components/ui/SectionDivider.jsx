export default function SectionDivider({ icon: Icon, text, iconClassName = "" }) {
  return (
    <div className="mt-8 flex items-center gap-3">
      <div className="h-px flex-1 bg-slate-200" />
      <div className="flex items-center gap-2 text-sm text-slate-400">
        {Icon && <Icon size={14} className={iconClassName} />}
        <span className="text-center">{text}</span>
      </div>
      <div className="h-px flex-1 bg-slate-200" />
    </div>
  );
}