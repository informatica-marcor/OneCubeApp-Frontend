import React from "react";

export default function UserDesktopSkeleton({ length = 5 }) {
  // Generamos el array de filas basado en el parámetro length
  const skeletonRows = Array.from({ length });

  return (
    <div className="hidden lg:block">
      <div className="overflow-hidden rounded-[22px] bg-white shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0">
            <thead>
              <tr className="bg-[#F6F7F9] text-left">
                <th className="px-6 py-4 text-base font-bold uppercase tracking-wide text-slate-400">
                  RUT Empresa
                </th>
                <th className="px-6 py-4 text-base font-bold uppercase tracking-wide text-slate-400">
                  Empresa
                </th>
                <th className="px-6 py-4 text-base font-bold uppercase tracking-wide text-slate-400">
                  RUT
                </th>
                <th className="px-6 py-4 text-base font-bold uppercase tracking-wide text-slate-400">
                  Nombre
                </th>
                <th className="px-6 py-4 text-base font-bold uppercase tracking-wide text-slate-400">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {skeletonRows.map((_, index) => (
                <tr key={index} className="animate-pulse">
                  {/* Skeleton RUT Empresa */}
                  <td className="border-t border-[#EAECF0] px-6 py-5">
                    <div className="h-5 w-24 rounded bg-slate-100"></div>
                  </td>

                  {/* Skeleton Empresa */}
                  <td className="border-t border-[#EAECF0] px-6 py-5">
                    <div className="h-5 w-32 rounded bg-slate-100"></div>
                  </td>

                  {/* Skeleton RUT */}
                  <td className="border-t border-[#EAECF0] px-6 py-5">
                    <div className="h-5 w-24 rounded bg-slate-100"></div>
                  </td>

                  {/* Skeleton Nombre */}
                  <td className="border-t border-[#EAECF0] px-6 py-5">
                    <div className="h-5 w-40 rounded bg-slate-100"></div>
                  </td>

                  {/* Skeleton Acciones */}
                  <td className="border-t border-[#EAECF0] px-6 py-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="h-10 w-40 rounded-[12px] bg-slate-200"></div>
                      <div className="h-10 w-40 rounded-[12px] bg-red-100/50"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}