import { Eye, Pencil, Trash2, LoaderCircle } from "lucide-react";

function InfoBlock({ label, value, align = "left" }) {
  return (
    <div className={align === "right" ? "text-right" : "text-left"}>
      <p className="text-sm font-semibold uppercase leading-none tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold leading-tight text-slate-900">
        {value || "—"}
      </p>
    </div>
  );
}

export default function UserMobile({
  users = [],
  onView,
  onDelete,
}) {
  return (
    <div className="space-y-4 lg:hidden">
      {users.length === 0 ? (
        <div className="rounded-[22px] px-5 p5,y-8 text-center text-lg font-bold text-slate-600">
          No se han encontrado clientes.
        </div>
      ) : (
        users.map((user, index) => (
          <article
            key={user.id ?? index}
            className="rounded-[22px] bg-white p-6 shadow-lg"
          >
            {(user.company_rut || user.company_name) && (
              <div className="grid grid-cols-2 gap-2">
                <InfoBlock label="RUT Empresa" value={user.company_rut} />
                <InfoBlock
                  label="Empresa"
                  value={user.company_name}
                  align="right"
                />
              </div>
            )}

            <div
              className={`grid grid-cols-2 gap-2 ${user.company_rut || user.company_name ? "mt-4" : ""}`}
            >
              <InfoBlock label="RUT" value={user.rut} />
              <InfoBlock label="Nombre" value={user.name} align="right" />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onView?.(user)}
                className="flex w-full items-center justify-center gap-2 rounded-[12px] border-2 border-slate-500 px-4 py-3 text-lg font-semibold text-slate-900 transition hover:bg-slate-300"
              >
                Examinar
                <Eye size={16} />
              </button>

              <button
                type="button"
                onClick={() => onDelete?.(user)}
                className="flex w-full items-center justify-center gap-2 rounded-[12px] border-2 border-red-600 bg-red-50 px-4 py-3 text-lg font-semibold text-red-600 transition hover:bg-red-100"
              >
                Eliminar
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </article>
        ))
      )}
    </div>
  );
}