export default function UserMobileSkeleton({ length = 4 }) {
  const skeletonCards = Array.from({ length });

  return (
    <div className="space-y-4 lg:hidden">
      {skeletonCards.map((_, index) => (
        <article
          key={index}
          className="animate-pulse rounded-[22px] bg-white p-6 shadow-lg"
        >
          {/* Fila 1: RUT Empresa y Empresa */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="h-3 w-20 rounded bg-slate-200"></div>
              <div className="mt-2 h-5 w-28 rounded bg-slate-100"></div>
            </div>
            <div className="flex flex-col items-end">
              <div className="h-3 w-16 rounded bg-slate-200"></div>
              <div className="mt-2 h-5 w-32 rounded bg-slate-100"></div>
            </div>
          </div>

          {/* Fila 2: RUT y Nombre */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div>
              <div className="h-3 w-12 rounded bg-slate-200"></div>
              <div className="mt-2 h-5 w-24 rounded bg-slate-100"></div>
            </div>
            <div className="flex flex-col items-end">
              <div className="h-3 w-16 rounded bg-slate-200"></div>
              <div className="mt-2 h-5 w-36 rounded bg-slate-100"></div>
            </div>
          </div>

          {/* Fila 3: Botones de Acción */}
          <div className="mt-5 grid grid-cols-2 gap-2">
            <div className="h-[46px] w-full rounded-[12px] bg-slate-200"></div>
            <div className="h-[46px] w-full rounded-[12px] bg-red-100/50"></div>
          </div>
        </article>
      ))}
    </div>
  );
}