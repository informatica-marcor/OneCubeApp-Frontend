import React, { useEffect, useState, useMemo } from "react";
import MonitorDesktop from "../components/monitor/MonitorDesktop";
import MonitorMobile from "../components/monitor/MonitorMobile";
import MonitorDesktopSkeleton from "../components/monitor/MonitorDesktopSkeleton";
import MonitorMobileSkeleton from "../components/monitor/MonitorMobileSkeleton";
import useGetEvents from "../components/hooks/useGetEvents";
import { Search } from "lucide-react";

export default function Monitor() {

    const { events, isEventsLoading, eventsError } = useGetEvents();
    const [search, setSearch] = useState("");

    const filteredEvents = useMemo(() => {
        const term = search.trim().toLowerCase();

        if (!term) return events ?? [];

        return (events ?? []).filter((event) => {
            const values = [
                event?.device_name,
                event?.user_name,
                event?.event_type,
                event?.created_at,
            ];

            return values.some((value) =>
                String(value ?? "").toLowerCase().includes(term)
            );
        });
    }, [events, search]);

    if (eventsError) return <p>Hubo un error al cargar la página.</p>

    return (
        <section className="space-y-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative w-full">
                    <Search
                        size={20}
                        className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#3A3A3A]"
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar registro"
                        className="h-14 w-full rounded-full border border-transparent bg-white pl-14 pr-5 text-lg font-medium text-slate-600 shadow-lg outline-none transition placeholder:text-slate-400 focus:border-emerald-500"
                    />
                </div>
            </div>

            {isEventsLoading ? (
                <>
                    <MonitorDesktopSkeleton rows={3} />
                    <MonitorMobileSkeleton cards={3} />
                </>
            ) : (
                <>
                    <MonitorDesktop events={filteredEvents} />
                    <MonitorMobile events={filteredEvents} />
                </>
            )}
        </section>
    );
}