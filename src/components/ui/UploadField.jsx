import { Upload } from "lucide-react";

export default function UploadField({ label = "Subir Rostro", onChange, fileName }) {
  return (
    <div className="-space-y-0.5">
      <label className="block text-lg font-semibold text-slate-800">
        Archivo
      </label>

      <label className="flex h-14 w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 text-base font-semibold text-slate-800 transition hover:bg-slate-50">
        <Upload size={22} />
        <span>{fileName || label}</span>
        <input
          type="file"
          accept="image/*"
          onChange={onChange}
          className="hidden"
        />
      </label>
    </div>
  );
}