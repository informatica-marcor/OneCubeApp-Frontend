import React from "react";
import { NavLink } from "react-router-dom";

export default function NavItem({
  to,
  icon: Icon,
  label,
  mobile = false,
}) {
  const baseClasses = mobile
    ? "flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors"
    : "flex items-center gap-3 rounded-xl px-4 py-4 text-sm font-medium transition-all";

  const activeClasses = mobile
    ? "text-emerald-600"
    : "bg-emerald-50 text-emerald-600";

  const inactiveClasses = mobile
    ? "text-slate-500 hover:text-slate-700"
    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900";

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
      }
    >
      <Icon className={mobile ? "h-5 w-5" : "h-5 w-5"} strokeWidth={1.8} />
      <span>{label}</span>
    </NavLink>
  );
}