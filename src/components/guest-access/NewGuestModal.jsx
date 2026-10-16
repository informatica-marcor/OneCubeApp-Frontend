import React, { useState, useMemo, useRef, useEffect } from "react";
import { Upload, Save, LoaderCircle, Info } from "lucide-react";
import { formatRut, validateEmail, validateRut } from "../utils/utils";
import FormField from "../ui/FormField";

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

export default function NewGuestModal({ open, onClose, onSave, maxDate }) {
  const [faceImage, setFaceImage] = useState(null);
  const [isUploadingFace, setIsUploadingFace] = useState(false);
  const [facePreview, setFacePreview] = useState("");
  const fileInputRef = useRef(null);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    rut: "",
    email: "",
    startDate: "",
    endDate: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      rut: "",
      email: "",
      startDate: "",
      endDate: "",
    });

    setErrors({});
    setFaceImage(null);
    setFacePreview("");
    setIsUploadingFace(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  useEffect(() => {
    if (!open) return;
    resetForm();
  }, [open]);

  const handleFaceUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        faceImage: "Debes subir una imagen PNG o JPG",
      }));
      setFaceImage(null);
      setFacePreview("");
      return;
    }

    setErrors((prev) => ({
      ...prev,
      faceImage: null,
    }));

    setIsUploadingFace(true);

    try {
      // Simulación de carga visual
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setFaceImage(file);
      setFacePreview(URL.createObjectURL(file));
    } finally {
      setIsUploadingFace(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!faceImage) {
      setErrors((prev) => ({
        ...prev,
        faceImage: "Debes subir una imagen del rostro",
      }));
      return;
    }

    onSave({
      ...formData,
      faceImage,
    });

    resetForm();
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "rut") {
      const formattedValue = formatRut(value);

      if (formattedValue.length <= 12) {
        setFormData((prev) => ({ ...prev, [name]: formattedValue }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name] || errors.dates) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
        dates: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!validateEmail(formData.email)) {
      newErrors.email = "Email inválido (ej: example@domain.com)";
    }

    if (!validateRut(formData.rut)) {
      newErrors.rut = "RUT inválido (ej: 12.345.678-k)";
    }

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es obligatorio";
    }

    if (!formData.startDate.trim() || !formData.endDate.trim()) {
      newErrors.dates = "Las fechas son obligatorias";
    } else {
      const now = new Date();
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const maxAllowedDate = new Date(maxDate);

      if (start < now) {
        newErrors.dates = "Puedes dar permiso desde la fecha y hora actual";
      } else if (end <= start) {
        newErrors.dates = "Las fechas no son compatibles";
      } else if (maxAllowedDate && end > maxAllowedDate) {
        if (maxDate) {
          newErrors.dates = `Puedes dar permiso hasta el ${formatDateLabel(maxDate)}`;
        } else {
          newErrors.dates = "No tienes permitido otorgar permisos";
        }
      }
    }

    if (!faceImage) {
      newErrors.faceImage = "Debes subir una imagen del rostro";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-[640px] flex-col rounded-2xl bg-white shadow-2xl">
        <div className="px-6 pt-6 text-center sm:px-8 sm:pt-8 flex-shrink-0">
          <h2 className="text-3xl font-bold text-slate-900">
            Nuevo Visitante
          </h2>
        </div>

        <div className="custom-scrollbar flex-1 overflow-y-auto px-6 py-4 sm:px-8">
          <form id="new-visit-form" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <FormField label="Nombre" error={errors.name}>
                <input
                  type="text"
                  name="name"
                  placeholder="Escribe aquí el nombre"
                  value={formData.name}
                  className={`h-14 w-full rounded-xl border ${errors.name ? "border-red-500" : "border-[#D0D5DD]"
                    } bg-white px-4 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500`}
                  onChange={handleChange}
                />
              </FormField>

              <FormField label="Rut" error={errors.rut}>
                <input
                  type="text"
                  name="rut"
                  placeholder="12.345.678-k"
                  value={formData.rut}
                  className={`h-14 w-full rounded-xl border ${errors.rut ? "border-red-500" : "border-[#D0D5DD]"
                    } bg-white px-4 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500`}
                  onChange={handleChange}
                />
              </FormField>

              <FormField label="Email" error={errors.email}>
                <input
                  type="text"
                  name="email"
                  placeholder="ejemplo@dominio.com"
                  value={formData.email}
                  className={`h-14 w-full rounded-xl border ${errors.email ? "border-red-500" : "border-[#D0D5DD]"
                    } bg-white px-4 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500`}
                  onChange={handleChange}
                />
              </FormField>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField label="Desde">
                  <div className="relative">
                    <input
                      type="datetime-local"
                      name="startDate"
                      value={formData.startDate}
                      className={`h-14 w-full rounded-xl border ${errors.dates ? "border-red-500" : "border-[#D0D5DD]"
                        } bg-white px-4 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500`}
                      onChange={handleChange}
                    />
                  </div>
                </FormField>

                <FormField label="Hasta">
                  <div className="relative">
                    <input
                      type="datetime-local"
                      name="endDate"
                      value={formData.endDate}
                      className={`h-14 w-full rounded-xl border ${errors.dates ? "border-red-500" : "border-[#D0D5DD]"
                        } bg-white px-4 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500`}
                      onChange={handleChange}
                    />
                  </div>
                </FormField>
              </div>

              <p className={`text-xs text-center font-medium ${errors.dates ? "text-red-500" : "text-transparent"}`}>
                {errors.dates || ""}
              </p>

              <FormField label="Rostro" error={errors.faceImage}>
                <div className="mt-4 flex gap-2 rounded-2xl border border-amber-300 bg-amber-50 p-3 text-sm font-medium text-amber-800">
                  <Info className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>
                    Sube una foto clara del rostro. Esta se usará para permitir el acceso con reconocimiento facial.
                  </p>
                </div>
                <div className="space-y-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                    className="hidden"
                    onChange={handleFaceUpload}
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingFace}
                    className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-200 py-4 font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isUploadingFace ? (
                      <>
                        <LoaderCircle className="h-5 w-5 animate-spin" />
                        Subiendo rostro...
                      </>
                    ) : (
                      <>
                        <Upload className="h-5 w-5" />
                        {faceImage ? "Cambiar rostro" : "Subir Rostro"}
                      </>
                    )}
                  </button>

                  {faceImage && (
                    <p className="text-sm text-emerald-600">
                      Imagen cargada: {faceImage.name}
                    </p>
                  )}

                  {facePreview && (
                    <img
                      src={facePreview}
                      alt="Vista previa del rostro"
                      className="h-32 w-32 rounded-xl object-cover border border-slate-200"
                    />
                  )}
                </div>
              </FormField>
            </div>
          </form>
        </div>

        <div className="flex-shrink-0 border-t border-slate-100 px-6 pb-6 pt-4 sm:px-8 sm:pb-8">
          <div className="grid grid-cols-2 gap-1 sm:grid-cols-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border-2 border-slate-900 py-4 text-lg font-bold text-slate-900 transition hover:bg-slate-200"
            >
              Cancelar
            </button>

            <button
              type="submit"
              form="new-visit-form"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-emerald-700 bg-emerald-500 py-4 text-lg font-bold text-white shadow-lg shadow-emerald-100 transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Guardar
              <Save className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}