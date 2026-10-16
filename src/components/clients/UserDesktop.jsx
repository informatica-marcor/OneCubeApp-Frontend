import { Eye, Pencil, Trash2, LoaderCircle } from "lucide-react";

export default function UserDesktop({
  users = [],
  onView,
  onDelete
}) {
  return (
    <div className="hidden lg:block">
      <div className="overflow-hidden rounded-[22px] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
        <div className="max-h-[calc(100vh-210px)] overflow-auto">
          <table className="w-full border-separate border-spacing-0">
            <thead className="sticky top-0 z-10">
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

            <tbody >
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-xl font-semibold text-slate-500"
                  >

                    No hay clientes disponibles.
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr
                    key={user.id ?? index}
                    className="border-t border-[#EAECF0] text-slate-800"
                  >
                    <td className="border-t border-[#EAECF0] px-6 py-5 text-lg font-medium">
                      {user.company_rut || "—"}
                    </td>

                    <td className="border-t border-[#EAECF0] px-6 py-5 text-lg font-medium">
                      {user.company_name || "—"}
                    </td>

                    <td className="border-t border-[#EAECF0] px-6 py-5 text-lg font-medium">
                      {user.rut || "—"}
                    </td>

                    <td className="border-t border-[#EAECF0] px-6 py-5 text-lg font-medium">
                      {user.name || "—"}
                    </td>

                    <td className="border-t border-[#EAECF0] px-6 py-4">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => onView?.(user)}
                          className="flex h-11 w-full items-center justify-center gap-2 rounded-[12px] border-2 border-slate-500 bg-white px-4 text-lg font-semibold text-slate-900 transition hover:bg-slate-100"
                        >
                          <span>Examinar</span>
                          <Eye size={20} />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDelete?.(user)}
                          className="flex h-11 w-full items-center justify-center gap-2 rounded-[12px] border-2 border-red-600 bg-red-50 px-4 text-lg font-semibold text-red-600 transition hover:bg-red-100"
                        >
                          Eliminar
                          <Trash2 size={16} />

                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}