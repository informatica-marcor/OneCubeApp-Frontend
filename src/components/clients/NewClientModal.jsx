import React, { useMemo, useState } from "react";
import { Check, Circle, Save } from "lucide-react";
import { formatRut, validateEmail, validateRut } from "../utils/utils";
import FormField from "../ui/FormField";

const CLIENT_TYPES = {
  COMPANY: "company",
  NATURAL_PERSON: "natural_person",
};

const initialForm = {
  clientType: CLIENT_TYPES.COMPANY,
  company_rut: "",
  company_name: "",
  rut: "",
  name: "",
  email: "",
};

export default function NewClientModal({ open, onClose, onSave }) {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const isNaturalPerson = formData.clientType === CLIENT_TYPES.NATURAL_PERSON;

  const isFormIncomplete = useMemo(() => {
    const basicFields = formData.rut.trim() && formData.name.trim() && formData.email.trim();

    if (isNaturalPerson) {
      return !basicFields;
    }

    return !(basicFields && formData.company_rut.trim() && formData.company_name.trim());
  }, [formData, isNaturalPerson]);

  const visibleForm = useMemo(() => {
    if (isNaturalPerson) {
      return {
        ...formData,
        company_rut: "",
        company_name: "",
      };
    }
    return formData;
  }, [formData, isNaturalPerson]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "rut" || name === "company_rut") {
      const formattedValue = formatRut(value);

      if (formattedValue.length <= 12) {
        setFormData((prev) => ({ ...prev, [name]: formattedValue }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar Email
    if (!validateEmail(formData.email)) {
      newErrors.email = "Email inválido (ej: example@domain.com)";
    }

    // Validar RUT Personal
    if (!validateRut(formData.rut)) {
      newErrors.rut = "RUT inválido (ej: 12.345.678-k)";
    }

    // Validar Nombre
    if (!formData.name.trim()) {
      newErrors.name = "El nombre es obligatorio";
    }

    // Validaciones extra si es Empresa
    if (!isNaturalPerson) {
      if (!validateRut(formData.company_rut)) {
        newErrors.company_rut = "RUT Empresa inválido";
      }
      if (!formData.company_name.trim()) {
        newErrors.company_name = "El nombre de empresa es obligatorio";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave?.(visibleForm);
    }
  };

  const handleClose = () => {
    setFormData(initialForm);
    setErrors({});
    onClose?.();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      {/* Contenedor Principal con altura máxima */}
      <div className="w-full max-w-[640px] max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-2xl">

        {/* Header Fijo */}
        <div className="px-6 pt-6 sm:px-8 sm:pt-8 text-center flex-shrink-0">
            <h2 className="text-3xl font-bold text-slate-900">
              Nuevo Cliente
            </h2>
        </div>

        {/* Cuerpo con Scroll */}
        <div className="flex-1 overflow-y-auto px-6 py-4 sm:px-8 custom-scrollbar">
          <form id="new-client-form" onSubmit={handleSubmit}>
            <div className="mb-7 grid grid-cols-2 gap-4 sm:gap-8">
              <TypeOption
                label="Empresa"
                active={formData.clientType === CLIENT_TYPES.COMPANY}
                onClick={() => setFormData(prev => ({ ...prev, clientType: CLIENT_TYPES.COMPANY }))}
              />
              <TypeOption
                label="Persona Natural"
                active={formData.clientType === CLIENT_TYPES.NATURAL_PERSON}
                onClick={() => setFormData(prev => ({ ...prev, clientType: CLIENT_TYPES.NATURAL_PERSON }))}
              />
            </div>

            <div className="space-y-5">
              {!isNaturalPerson && (
                <>
                  <FormField label="Rut Empresa" error={errors.company_rut}>
                    <input
                      type="text"
                      name="company_rut"
                      value={formData.company_rut}
                      onChange={handleChange}
                      placeholder="12.345.678-K"
                      className={`h-14 w-full rounded-xl border ${errors.company_rut ? 'border-red-500' : 'border-[#D0D5DD]'} bg-white px-4 text-[16px] text-[#111827] outline-none transition focus:border-[#00D84A] focus:ring-2 focus:ring-[#00D84A]/15`}
                    />
                  </FormField>

                  <FormField label="Nombre Empresa" error={errors.company_name}>
                    <input
                      type="text"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleChange}
                      placeholder="Escribe aquí la empresa"
                      className={`h-14 w-full rounded-xl border ${errors.company_name ? 'border-red-500' : 'border-[#D0D5DD]'} bg-white px-4 text-[16px] text-[#111827] outline-none transition focus:ring-2 focus:ring-[#00D84A]/15`}
                    />
                  </FormField>
                </>
              )}

              <FormField label="Rut" error={errors.rut}>
                <input
                  type="text"
                  name="rut"
                  value={formData.rut}
                  onChange={handleChange}
                  placeholder="12.345.678-k"
                  className={`h-14 w-full rounded-xl border ${errors.rut ? 'border-red-500' : 'border-[#D0D5DD]'} bg-white px-4 text-[16px] text-[#111827] outline-none transition focus:ring-2 focus:ring-[#00D84A]/15`}
                />
              </FormField>

              <FormField label="Nombre" error={errors.name}>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Escribe aquí el nombre"
                  className={`h-14 w-full rounded-xl border ${errors.name ? 'border-red-500' : 'border-[#D0D5DD]'} bg-white px-4 text-[16px] text-[#111827] outline-none transition focus:ring-2 focus:ring-[#00D84A]/15`}
                />
              </FormField>

              <FormField label="Email" error={errors.email}>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@domain.com"
                  className={`h-14 w-full rounded-xl border ${errors.email ? 'border-red-500' : 'border-[#D0D5DD]'} bg-white px-4 text-[16px] text-[#111827] outline-none transition focus:ring-2 focus:ring-emerald-500`}
                />
              </FormField>
            </div>
          </form>
        </div>

        {/* Footer Fijo con Botones */}
        <div className="px-6 pb-6 pt-4 sm:px-8 sm:pb-8 flex-shrink-0 border-t border-slate-100">
          <div className="grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 rounded-xl border border-slate-300 py-4 text-lg font-bold text-slate-500 transition hover:bg-slate-100"
            >
              Cancelar
            </button>

            <button
              type="submit"
              form="new-client-form"
              disabled={isFormIncomplete}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 py-4 text-lg font-bold text-white shadow-lg shadow-emerald-100 transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-5 w-5" />
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TypeOption({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center gap-3 py-1 text-center"
    >
      <span className="flex h-5 w-5 items-center justify-center">
        {active ? (
          <Check className="h-5 w-5 text-emerald-500" strokeWidth={2.5} />
        ) : (
          <Circle className="h-5 w-5 text-[#98A2B3]" />
        )}
      </span>
      <span className={`text-xl font-semibold ${active ? "text-emerald-500" : "text-slate-400"}`}>
        {label}
      </span>
    </button>
  );
}