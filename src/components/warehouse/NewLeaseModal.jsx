import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, ChevronDown, Save, Search, X } from "lucide-react";
import FormField from "../ui/FormField";

function formatWarehouseTitle(warehouse) {
  if (!warehouse) return "Arriendo Bodega";
  return warehouse.name ? `Arriendo ${warehouse.name}` : "Arriendo Bodega";
}

function buildInitialForm() {
  return {
    client_id: "",
    start_date: "",
    end_date: "",
  };
}

export default function NewLeaseModal({
  open,
  warehouse,
  clients = [],
  onClose,
  onSave,
  isSaving = false,
}) {
  const [formData, setFormData] = useState({
    client_id: "",
    start_date: "",
    end_date: "",
  });

  const [clientQuery, setClientQuery] = useState("");
  const [clientSelectorOpen, setClientSelectorOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const selectorRef = useRef(null);

  useEffect(() => {
    if (!open) {
      setFormData({
        client_id: "",
        start_date: "",
        end_date: "",
      });

      setClientQuery("");
      setClientSelectorOpen(false);
    }
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!selectorRef.current) return;
      if (!selectorRef.current.contains(event.target)) {
        setClientSelectorOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredClients = useMemo(() => {
    const term = clientQuery.trim().toLowerCase();

    if (!term) return clients ?? [];

    return (clients ?? []).filter((client) => {
      const values = [
        client?.name,
        client?.rut,
        client?.company_name,
        client?.company_rut,
        client?.email,
      ];

      return values.some((value) =>
        String(value ?? "").toLowerCase().includes(term)
      );
    });
  }, [clients, clientQuery]);

  const selectedClient = useMemo(() => {
    return (clients ?? []).find(
      (client) => String(client.user_id) === String(formData.client_id)
    );
  }, [clients, formData.client_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });

    setErrors((prev) => ({
    ...prev,
    [name]: undefined,
  }));
  };

  const handleSelectClient = (client) => {
    setFormData((prev) => ({
      ...prev,
      client_id: client.user_id,
    }));

    setErrors((prev) => ({
      ...prev,
      client: undefined,
    }));

    setClientSelectorOpen(false);
    setClientQuery("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    const now = new Date();

    const startDate = formData.start_date
      ? new Date(formData.start_date)
      : null;

    const endDate = formData.end_date
      ? new Date(formData.end_date)
      : null;

    if (!formData.client_id) {
      newErrors.client = "Es necesario seleccionar un cliente";
    }

    if (!formData.start_date?.trim()) {
      newErrors.start_date = "Es necesario seleccionar una fecha de inicio";
    } else if (startDate < now) {
      newErrors.start_date =
        "La fecha de inicio debe ser mayor o igual a la fecha y hora actual";
    }

    if (!formData.end_date?.trim()) {
      newErrors.end_date = "Es necesario seleccionar una fecha de fin";
    } else if (startDate && endDate <= startDate) {
      newErrors.end_date =
        "La fecha de fin debe ser mayor a la fecha de inicio";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    onSave?.({
      client_id: Number(formData.client_id),
      warehouse_id: warehouse?.id,
      start_date: formData.start_date,
      end_date: formData.end_date,
    });
  };

  const handleClose = () => {
    if (isSaving) return;
    onClose?.();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-[640px] rounded-[22px] bg-white shadow-[0_24px_64px_rgba(15,23,42,0.24)]">
        <div className="p-5 sm:p-6 lg:p-8">
          <div className="mb-7 flex items-center justify-center">
            <h2 className="text-center text-3xl font-bold text-slate-900">
              {formatWarehouseTitle(warehouse)}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div ref={selectorRef}>
              <label className="mb-2 block text-base font-semibold text-slate-400 uppercase">
                Cliente
              </label>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setClientSelectorOpen((prev) => !prev)}
                  className={`flex h-[56px] w-full items-center justify-between rounded-[14px] border bg-white px-4 text-left transition ${errors.client
                      ? "border-red-500 focus:ring-2 focus:ring-red-500/15"
                      : "border-[#D0D5DD]"
                    }`}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-4 overflow-hidden">
                    <span className="truncate text-lg text-slate-500">
                      {selectedClient?.name || "Selecciona un cliente"}
                    </span>

                    <span className="truncate text-lg text-slate-500">
                      {selectedClient?.rut || ""}
                    </span>
                  </div>

                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-[#667085] transition ${clientSelectorOpen ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {clientSelectorOpen && (
                  <div className="absolute left-0 top-[calc(100%+8px)] z-20 w-full overflow-hidden rounded-[16px] border border-[#E5E7EB] bg-white shadow-[0_20px_40px_rgba(15,23,42,0.12)]">
                    <div className="border-b border-[#EAECF0] p-3">
                      <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />
                        <input
                          type="text"
                          value={clientQuery}
                          onChange={(e) => setClientQuery(e.target.value)}
                          placeholder="Buscar cliente"
                          className="h-11 w-full rounded-[12px] border border-[#D0D5DD] bg-white pl-10 pr-10 text-[15px] text-[#111827] outline-none transition placeholder:text-[#98A2B3] focus:border-[#00D84A] focus:ring-2 focus:ring-[#00D84A]/15"
                        />

                        {clientQuery && (
                          <button
                            type="button"
                            onClick={() => setClientQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#98A2B3] hover:text-[#667085]"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="max-h-[240px] overflow-y-auto py-2">
                      {filteredClients.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-[#98A2B3]">
                          No se encontraron clientes.
                        </div>
                      ) : (
                        filteredClients.map((client) => {
                          const isSelected =
                            String(client.user_id) === String(formData.client_id);

                          return (
                            <button
                              key={client.user_id}
                              type="button"
                              onClick={() => handleSelectClient(client)}
                              className={`flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition hover:bg-[#F9FAFB] ${isSelected ? "bg-[#F6FFF9]" : ""
                                }`}
                            >
                              <div className="min-w-0">
                                <p className="truncate text-[15px] font-semibold text-[#111827]">
                                  {client.name || "Sin nombre"}
                                </p>
                                <p className="truncate text-[14px] text-[#98A2B3]">
                                  {client.company_name || "Cliente"}
                                </p>
                              </div>

                              <div className="shrink-0 text-[14px] text-[#667085]">
                                {client.rut || "—"}
                              </div>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="min-h-[20px] pt-1">
                {errors.client && (
                  <p className="text-sm font-medium text-red-500">
                    {errors.client}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-base font-semibold text-slate-400 uppercase">
                  Desde
                </label>

                <input
                  type="datetime-local"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className={`h-[56px] w-full rounded-[14px] border bg-white px-4 text-lg text-slate-500 outline-none transition focus:ring-2 ${errors.start_date
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/15"
                      : "border-[#D0D5DD] focus:border-[#00D84A] focus:ring-[#00D84A]/15"
                    }`}
                />

                <div className="min-h-[20px] pt-1">
                  {errors.start_date && (
                    <p className="text-sm font-medium text-red-500">
                      {errors.start_date}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-base font-semibold text-slate-400 uppercase">
                  Hasta
                </label>

                <input
                  type="datetime-local"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  className={`h-[56px] w-full rounded-[14px] border bg-white px-4 text-lg text-slate-500 outline-none transition focus:ring-2 ${errors.end_date
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/15"
                      : "border-[#D0D5DD] focus:border-[#00D84A] focus:ring-[#00D84A]/15"
                    }`}
                />

                <div className="min-h-[20px] pt-1">
                  {errors.end_date && (
                    <p className="text-sm font-medium text-red-500">
                      {errors.end_date}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSaving}
                className="flex-1 rounded-xl border-2 border-slate-500 py-4 text-lg font-bold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 py-4 text-lg font-bold text-white shadow-lg shadow-emerald-100 transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <CalendarDays className="h-5 w-5" />
                Arrendar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}