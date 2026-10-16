import {
  Mail,
  ArrowRight,
  ShieldCheck,
  CircleAlert,
  LifeBuoy,
  LoaderCircle,
} from "lucide-react";

export default function EmailStep({
  email,
  setEmail,
  onContinue,
  error,
  isLoading = false,
}) {

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = emailRegex.test(email);

  return (
    <div className="w-full">
      <h1 className="text-[28px] font-bold leading-tight text-slate-900 md:text-5xl">
        Iniciar Sesión
      </h1>

      <p className="mt-3 text-[15px] leading-6 text-slate-500 md:max-w-md md:text-base">
        Ingresa tu correo para acceder al sistema de gestión.
      </p>

      <div className="mt-8">
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Correo electrónico
        </label>

        <div
          className={`flex h-14 items-center rounded-xl border bg-white px-4 transition ${
            error
              ? "border-red-400 ring-2 ring-red-100"
              : "border-slate-300 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100"
          } ${isLoading ? "opacity-70" : ""}`}
        >
          <Mail
            size={24}
            className={error ? "text-red-400" : "text-slate-400"}
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
            placeholder="email@domain.com"
            disabled={isLoading}
            className="ml-3 h-full w-full bg-transparent text-[15px] text-slate-700 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
          />
          {error && !isLoading && <CircleAlert size={18} className="text-red-400" />}
        </div>

        {error && (
          <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-500">
            <CircleAlert size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      <button
        onClick={onContinue}
        disabled={isLoading || !isValidEmail}
        className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#4BAE52] px-6 text-lg font-semibold text-white shadow-lg shadow-emerald-100 transition hover:brightness-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:brightness-100"
      >
        {isLoading ? (
          <>
            <LoaderCircle size={20} className="animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            {error ? "Intentar con otro correo" : "Continuar"}
            <ArrowRight size={20} />
          </>
        )}
      </button>

      <div className="mt-8 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <div className="flex items-center gap-2 text-sm text-slate-400">
          {error ? (
            <>
              <LifeBuoy size={14} />
              <span className="text-center">
                Contacta al administrador del sistema
              </span>
            </>
          ) : (
            <>
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>Autenticación segura</span>
            </>
          )}
        </div>
        <div className="h-px flex-1 bg-slate-200" />
      </div>
    </div>
  );
}