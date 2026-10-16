import React from "react";
import { RefreshCw, LogOut, Trash2 } from "lucide-react";

export default function GuestAccessDesktop({
  visitors = [],
  onRenew,
  onEnd,
  onDelete
}) {
  return (
    <div className="hidden lg:block">
      <div className="overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-200">
        <div className="max-h-[calc(100vh-210px)] overflow-auto">
          <table className="w-full border-separate border-spacing-0">
            <thead className="sticky top-0 z-10">
              <tr className="text-left">
                <th className="px-6 py-4 text-base font-bold uppercase tracking-wide text-slate-400">
                  RUT
                </th>
                <th className="px-6 py-4 text-base font-bold uppercase tracking-wide text-slate-400">
                  Nombre
                </th>
                <th className="px-6 py-4 text-base font-bold uppercase tracking-wide text-slate-400">
                  Estado
                </th>
                <th className="px-6 py-4 text-base font-bold uppercase tracking-wide text-slate-400">
                  Inicio
                </th>
                <th className="px-6 py-4 text-base font-bold uppercase tracking-wide text-slate-400">
                  Término
                </th>
                <th className="px-6 py-4 text-base font-bold uppercase tracking-wide text-slate-400">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {visitors.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-6 text-center text-xl font-semibold text-slate-500"
                  >

                    No hay visitantes disponibles.
                  </td>
                </tr>
              ) : (
                visitors.map((visitor, index) => {
                  const parseDate = (dateString) => {
                    if (!dateString) return null;

                    const [datePart, timePart] = dateString.split(" ");
                    const [day, month, year] = datePart.split("/");

                    return new Date(`${year}-${month}-${day}T${timePart}`);
                  };

                  const now = new Date();

                  const startDate = parseDate(visitor.start_date);
                  const endDate = parseDate(visitor.end_date);

                  const isExpired = endDate && endDate < now;
                  const hasNotStarted = startDate && startDate > now;

                  const statusText = isExpired
                    ? "Expirado"
                    : hasNotStarted
                      ? "Pendiente"
                      : "Vigente";

                  const statusClass = isExpired
                    ? "text-red-500"
                    : hasNotStarted
                      ? "text-amber-500"
                      : "text-emerald-500";

                  return (
                    <tr
                      key={visitor.id ?? index}
                      className="border-t border-slate-200 text-slate-900"
                    >
                      <td className="border-t border-slate-200 px-6 py-5 text-lg font-medium">
                        {visitor.rut || "XX.XXX.XXX-X"}
                      </td>

                      <td className="border-t border-slate-200 px-6 py-5 text-lg font-medium">
                        {visitor.name || "—"}
                      </td>

                      <td className={`${statusClass} border-t border-slate-200 px-6 py-5 text-lg font-medium uppercase`}>
                        {statusText}
                      </td>

                      <td className="border-t border-slate-200 px-6 py-5 text-lg font-medium">
                        {visitor.start_date || "--/--/-- --:-- --"}
                      </td>

                      <td className="border-t border-slate-200 px-6 py-5 text-lg font-medium">
                        {visitor.end_date || "--/--/-- --:-- --"}
                      </td>

                      <td className="border-t border-slate-200 p-4">
                        <div className="grid grid-cols-2 gap-2">
                          {isExpired ? (
                            <button
                              type="button"
                              onClick={() => onRenew?.(visitor)}
                              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-4 text-lg font-semibold text-slate-900 transition hover:bg-slate-100"
                            >
                              <span>Renovar</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => onEnd?.(visitor)}
                              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-4 text-lg font-semibold text-slate-900 transition hover:bg-slate-100"
                            >
                              <span>Terminar</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => onDelete?.(visitor)}
                            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border-2 border-red-600 bg-red-50 px-4 text-lg font-semibold text-red-600 transition hover:bg-red-100"
                          >
                            Eliminar
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}