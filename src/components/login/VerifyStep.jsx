import {
    Mail,
    ChevronLeft,
    Clock3,
    Check,
    LoaderCircle,
} from "lucide-react";
import CodeInput from "../ui/CodeInput";
import { useEffect, useState } from "react";


export default function VerifyStep({ email, code, setCode, onBack, onConfirm, onResend, isLoading = false, isResending}) {
    const [timeLeft, setTimeLeft] = useState(300);

    useEffect(() => {
        if (timeLeft <= 0) {
            onBack();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, onBack]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const isCodeComplete = code.every(digit => digit !== "");

    return (
        <div className="w-full">
            <button
                onClick={onBack}
                className="mb-4 flex items-center justify-center gap-1 text-sm text-slate-400 transition hover:text-slate-600"
            >
                <ChevronLeft size={16} />
                Cambiar correo
            </button>

            <h1 className="text-[26px] font-bold leading-tight text-slate-900 md:text-5xl">
                Verifica tu identidad
            </h1>

            <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-slate-700">
                <Mail size={16} className="shrink-0 text-emerald-500" />
                <span className="truncate">
                    Código enviado a <span className="font-medium">{email}</span>
                </span>
            </div>

            <div className="mt-5">
                <label className="block text-sm font-semibold text-slate-700">
                    Código de verificación
                </label>

                <CodeInput value={code} onChange={setCode} />

                <div className={`mt-3 flex items-center gap-2 text-sm ${timeLeft < 30 ? 'text-red-500' : 'text-slate-400'}`}>
                    <Clock3 size={14} />
                    <span>El código expira en {formatTime(timeLeft)}</span>
                </div>
            </div>

            <button
                onClick={onConfirm}
                disabled={isLoading || timeLeft <= 0 || !isCodeComplete}
                className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#4BAE52] px-6 text-lg font-semibold text-white shadow-[0_10px_24px_rgba(6,214,79,0.28)] transition hover:brightness-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:brightness-100"
            >
                {isLoading ? (
                    <>
                        <LoaderCircle size={20} className="animate-spin" />
                        Verificando...
                    </>
                ) : (
                    <>
                        Confirmar acceso
                        <Check size={20} />
                    </>
                )}
            </button>

            {/* <p className="mt-5 text-center text-sm text-slate-400">
                ¿No recibiste el código?{" "}
                <button
                    onClick={onResend}
                    className="font-semibold text-emerald-500 hover:text-emerald-600"
                >
                    Reenviar
                </button>
            </p> */}
        </div>
    );
}