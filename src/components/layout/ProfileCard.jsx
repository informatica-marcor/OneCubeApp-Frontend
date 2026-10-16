import React from "react";
import { LogOut, Camera, Info, LoaderCircle, Mail, Building2 } from "lucide-react";

function InfoCard({ label, value, icon: Icon }) {
  return (
    <div className="p-2">
      <div className="flex items-center gap-2">
        {Icon ? <Icon className="h-4 w-4 text-slate-400" /> : null}
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
          {label}
        </span>
      </div>
      <div className="break-words text-sm font-semibold text-slate-700 sm:text-base">
        {value || "No disponible"}
      </div>
    </div>
  );
}

export default function ProfileCard({
  photo,
  isLoadingPhoto,
  user,
  onEdit,
  onLogout,
}) {
  return (
    <section className="w-full max-w-[440px] rounded-[24px] border-2 border-slate-300 bg-white p-4 shadow-md md:p-6">
      <div className="flex flex-col items-center">
        <div className="relative mx-auto w-fit">
          <div className="h-40 w-40 overflow-hidden rounded-[32px] border-[3px] border-slate-400 bg-emerald-100 md:h-40 md:w-40">
            {isLoadingPhoto ? (
              <div className="flex h-full w-full items-center justify-center">
                <LoaderCircle className="h-8 w-8 animate-spin text-emerald-700" />
              </div>
            ) : photo ? (
              <img
                src={photo}
                alt={user?.name || "Foto de perfil"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-3xl font-extrabold text-emerald-700 md:text-4xl">
                {(user?.name || "").trim().slice(0, 2).toUpperCase() || "US"}
              </div>
            )}
          </div>

          <button
            type="button"
            className="absolute bottom-2 -right-2 flex h-11 w-11 items-center justify-center rounded-full border-2 border-slate-200 bg-white text-slate-600 shadow-md transition hover:bg-slate-50"
            onClick={onEdit}
          >
            <Camera className="h-5 w-5" />
          </button>
        </div>

        {!isLoadingPhoto && !photo && (
          <div className="mt-4 flex gap-2 rounded-2xl border border-amber-300 bg-amber-50 p-3 text-sm font-medium text-amber-800">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              Sube una foto clara de tu rostro. Se usará para permitir tu acceso con reconocimiento facial.
            </p>
          </div>
        )}

        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">
          {user?.name}
        </h2>
        <span className="text-center text-lg font-semibold text-slate-700" >{user?.rut}</span>

      </div>

      <div className="space-y-1 mt-2">
        <InfoCard label="Email" value={user?.email || "-"} icon={Mail} />
        {(user?.company_name || user?.company_rut) && (
          <InfoCard
            label="Empresa"
            value={[user?.company_name, user?.company_rut].filter(Boolean).join(" - ")}
            icon={Building2}
          />
        )}
      </div>

      <div className="mt-8 space-y-4">
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-red-600 bg-rose-50 px-4 py-3.5 text-lg font-semibold text-red-600 transition hover:bg-rose-100"
        >
          <LogOut className="h-4 w-4" />
          Cerrar Sesión
        </button>
      </div>
    </section>
  );
}