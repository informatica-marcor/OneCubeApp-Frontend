import React, { useEffect, useMemo, useRef, useState } from "react";
import { Upload, Save, LoaderCircle, X } from "lucide-react";
import FormField from "../ui/FormField";

const MAX_IMAGES = 5;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg"];

export default function NewTicketReplyModal({ ticket, open, onClose, onSave }) {
  const fileInputRef = useRef(null);

  const [attachments, setAttachments] = useState([]);
  const [attachmentPreviews, setAttachmentPreviews] = useState([]);
  const [isUploadingAttachments, setIsUploadingAttachments] = useState(false);

  const [formData, setFormData] = useState({
    reply: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    return () => {
      attachmentPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [attachmentPreviews]);

  const resetForm = () => {
    attachmentPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));

    setFormData({
      reply: "",
    });
    setAttachments([]);
    setAttachmentPreviews([]);
    setErrors({});
    setIsUploadingAttachments(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    resetForm();
    onClose?.();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.reply.trim()) {
      newErrors.reply = "La respuesta es obligatoria";
    }

    if (attachments.length === 0) {
      newErrors.attachments = "Debes subir al menos una imagen";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAttachmentsUpload = async (e) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (!selectedFiles.length) return;

    const availableSlots = MAX_IMAGES - attachments.length;

    if (availableSlots <= 0) {
      setErrors((prev) => ({
        ...prev,
        attachments: `Solo puedes subir hasta ${MAX_IMAGES} imágenes`,
      }));
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const invalidFile = selectedFiles.find(
      (file) => !ALLOWED_TYPES.includes(file.type)
    );

    if (invalidFile) {
      setErrors((prev) => ({
        ...prev,
        attachments: "Solo puedes subir imágenes PNG o JPG",
      }));
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const filesToAdd = selectedFiles.slice(0, availableSlots);

    if (selectedFiles.length > availableSlots) {
      setErrors((prev) => ({
        ...prev,
        attachments: `Solo puedes subir hasta ${MAX_IMAGES} imágenes`,
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        attachments: null,
      }));
    }

    setIsUploadingAttachments(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newPreviews = filesToAdd.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
      }));

      setAttachments((prev) => [...prev, ...filesToAdd]);
      setAttachmentPreviews((prev) => [...prev, ...newPreviews]);
    } finally {
      setIsUploadingAttachments(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveAttachment = (indexToRemove) => {
    setAttachments((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );

    setAttachmentPreviews((prev) => {
      const previewToRemove = prev[indexToRemove];
      if (previewToRemove?.url) {
        URL.revokeObjectURL(previewToRemove.url);
      }

      return prev.filter((_, index) => index !== indexToRemove);
    });

    setErrors((prev) => ({
      ...prev,
      attachments: null,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSave({
      ...formData,
      ticketId: ticket.ticket_id,
      images: attachments,
    });

    resetForm();
  };

  const isFormIncomplete = useMemo(() => {
    const basicFieldsFilled =
      formData.reply.trim()

    return !basicFieldsFilled || attachments.length === 0 || isUploadingAttachments;
  }, [formData, attachments, isUploadingAttachments]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-[640px] flex-col rounded-2xl bg-white shadow-2xl">
        <div className="flex-shrink-0 px-6 pt-6 text-center sm:px-8 sm:pt-8">
          <h2 className="text-3xl font-bold text-slate-900">
            {ticket.subject}
          </h2>
        </div>

        <div className="custom-scrollbar flex-1 overflow-y-auto px-6 py-4 sm:px-8">
          <form id="new-help-form" onSubmit={handleSubmit}>
            <div className="space-y-5">

              <FormField label="Respuesta" error={errors.reply}>
                <textarea
                  name="reply"
                  placeholder="Ingresa tu respuesta..."
                  value={formData.reply}
                  onChange={handleChange}
                  rows={5}
                  className={`w-full rounded-xl border ${
                    errors.reply ? "border-red-500" : "border-[#D0D5DD]"
                  } bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500`}
                />
              </FormField>

              <FormField
                label={`Imágenes (${attachments.length}/${MAX_IMAGES})`}
                error={errors.attachments}
              >
                <div className="space-y-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                    multiple
                    className="hidden"
                    onChange={handleAttachmentsUpload}
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={
                      isUploadingAttachments || attachments.length >= MAX_IMAGES
                    }
                    className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-200 py-4 font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isUploadingAttachments ? (
                      <>
                        <LoaderCircle className="h-5 w-5 animate-spin" />
                        Subiendo imágenes...
                      </>
                    ) : (
                      <>
                        <Upload className="h-5 w-5" />
                        {attachments.length >= MAX_IMAGES
                          ? "Límite de imágenes alcanzado"
                          : "Subir imágenes"}
                      </>
                    )}
                  </button>

                  {attachments.length > 0 && (
                    <p className="text-sm text-slate-600">
                      Puedes subir hasta {MAX_IMAGES} imágenes en formato PNG o JPG.
                    </p>
                  )}

                  {attachmentPreviews.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {attachmentPreviews.map((preview, index) => (
                        <div
                          key={`${preview.name}-${index}`}
                          className="relative overflow-hidden rounded-xl border border-slate-200"
                        >
                          <img
                            src={preview.url}
                            alt={`Vista previa ${index + 1}`}
                            className="h-32 w-full object-cover"
                          />

                          <button
                            type="button"
                            onClick={() => handleRemoveAttachment(index)}
                            className="absolute right-2 top-2 rounded-full bg-black/70 p-1 text-white transition hover:bg-black"
                            aria-label={`Eliminar imagen ${index + 1}`}
                          >
                            <X className="h-4 w-4" />
                          </button>

                          <div className="truncate px-2 py-2 text-xs text-slate-600">
                            {preview.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </FormField>
            </div>
          </form>
        </div>

        <div className="flex-shrink-0 border-t border-slate-100 px-6 pb-6 pt-4 sm:px-8 sm:pb-8">
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
              form="new-help-form"
              disabled={isFormIncomplete}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 py-4 text-lg font-bold text-white shadow-lg shadow-emerald-100 transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-5 w-5" />
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}