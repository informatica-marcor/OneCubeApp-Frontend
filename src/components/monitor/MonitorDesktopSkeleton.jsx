export default function MonitorDesktopSkeleton({ length = 5}) {
    const skeletonRows = Array.from({ length });

    return (
        <div className="hidden lg:block space-y-5">
            {skeletonRows.map((_, index) => (
                <article
                    key={index}
                    className="grid animate-pulse items-center gap-6 rounded-[22px] border border-slate-100 bg-white px-8 py-6 shadow-sm"
                    style={{
                        gridTemplateColumns: "1fr 1fr 1fr 1fr",
                    }}
                >
                    {/* Skeleton Dispositivo */}
                    <div>
                        <div className="mb-2 h-3 w-20 rounded bg-slate-200"></div>
                        <div className="h-6 w-32 rounded bg-slate-100"></div>
                    </div>

                    {/* Skeleton Usuario */}
                    <div>
                        <div className="mb-2 h-3 w-16 rounded bg-slate-200"></div>
                        <div className="h-6 w-40 rounded bg-slate-100"></div>
                    </div>

                    {/* Skeleton Evento */}
                    <div>
                        <div className="mb-2 h-3 w-16 rounded bg-slate-200"></div>
                        <div className="h-6 w-28 rounded bg-slate-100"></div>
                    </div>

                    {/* Skeleton Fecha */}
                    <div>
                        <div className="mb-2 h-3 w-16 rounded bg-slate-200"></div>
                        <div className="h-6 w-36 rounded bg-slate-100"></div>
                    </div>
                </article>
            ))}
        </div>
    );
}