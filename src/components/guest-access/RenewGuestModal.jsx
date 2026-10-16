import React, { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";

const formatDateLabel = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("es-CL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function RenewGuestModal({ open, onClose, onSave, guest, maxDate }) {

  const [formData, setFormData] = useState({
    start_date: "",
    end_date: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setFormData({
        start_date: "",
        end_date: "",
      });
      setError("");
    }
  }, [open]);

  if (!open) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const now = new Date();
    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);
    const maxAllowedDate = new Date(maxDate);

    if (startDate < now) {
      setError('"Desde" debe ser mayor a la fecha y hora actual');
      return;
    }

    if (endDate <= startDate) {
      setError('"Hasta" debe ser mayor que "Desde"');
      return;
    }

    if (!maxDate) {
      newErrors.dates = "No tienes permitido otorgar permisos";
      return;
    }

    if (maxAllowedDate && endDate > maxAllowedDate) {
      setError(`"Hasta" no puede ser mayor a ${formatDateLabel(maxDate)}`);
      return;
    }

    const formattedData = {
      ...formData,
      start_date: formData.start_date.replace("T", " "),
      end_date: formData.end_date.replace("T", " "),
    };

    onSave({ ...guest, ...formattedData });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl transition-all">
        <h2 className="mb-6 text-center text-2xl font-bold text-zinc-900">
          Renovar Acceso
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="flex-1">
              <label className="mb-1 block text-sm font-bold tracking-widest uppercase text-slate-400">
                Desde
              </label>
              <input
                type="datetime-local"
                value={formData.start_date}
                onChange={(e) => handleChange("start_date", e.target.value)}
                className={`custom-datetime-input w-full rounded-xl border-2 p-3 text-zinc-600 focus:outline-none ${error
                  ? "border-red-500 focus:border-red-500"
                  : "border-zinc-200 focus:border-emerald-500"
                  }`}
              />
            </div>

            <div className="flex-1">
              <label className="mb-1 block text-sm font-bold tracking-widest uppercase text-slate-400">
                Hasta
              </label>
              <input
                type="datetime-local"
                value={formData.end_date}
                onChange={(e) => handleChange("end_date", e.target.value)}
                className={`custom-datetime-input w-full rounded-xl border-2 p-3 text-zinc-600 focus:outline-none ${error
                  ? "border-red-500 focus:border-red-500"
                  : "border-zinc-200 focus:border-emerald-500"
                  }`}
              />
            </div>
          </div>

          <p className={`min-h-4 text-sm text-center font-medium ${error ? "text-red-500" : "text-slate-400"}`}>
            {error || "Elige un rango de fechas para continuar con el proceso para otogar acceso."}
          </p>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border-2 border-slate-500 py-3 font-semibold text-lg text-slate-900 transition hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!formData.start_date || !formData.end_date}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-emerald-700 bg-emerald-500 py-3 font-semibold text-lg text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <RefreshCw className="h-5 w-5" />
              Renovar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}