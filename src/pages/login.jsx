import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthApi } from "../components/hooks/useAuthApi";
import { useAuth } from "../components/context/AuthContext";
import EmailStep from "../components/login/EmailStep";
import VerifyStep from "../components/login/VerifyStep";
import logo from '../assets/onecube-logo-sn.svg';

const CODE_LENGTH = 6;

export default function Login() {
  const [step, setStep] = useState("email");
  const [direction, setDirection] = useState("forward");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [code, setCode] = useState(Array(CODE_LENGTH).fill(""));

  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    requestCode,
    isRequesting,
    validateCode,
    isValidating,
  } = useAuthApi();

  const handleContinue = () => {
    if (isRequesting) return;

    requestCode(email, {
      onSuccess: () => {
        setDirection("forward");
        setStep("verify");
      },
      onError: (error) => {
        const errorCode = error.response?.status;
        const errorMessages = {
          403: "Actualmente solo se permite el ingreso de clientes y administradores.",
          404: "Usuario no registrado en la plataforma.",
          422: "El formato del correo no es válido.",
          500: "Falla en la comunicación con el servidor.",
        };

        const message = errorMessages[errorCode] || `Ocurrió un error inesperado. Inténtalo de nuevo más tarde.`;

        setError(message);
      },
    });
  };

  const handleBack = () => {
    if (isValidating) return;

    setDirection("backward");
    setStep("email");
    setError(null);
    setCode(Array(CODE_LENGTH).fill(""));
  };

  const handleConfirm = () => {
    if (isValidating) return;

    const fullCode = code.join("");
    if (fullCode.length !== CODE_LENGTH) return;

    validateCode(
      { email, code: fullCode },
      {
        onSuccess: (data) => {
          login(data);

          const role = data?.user?.role;

          if (role === "client") {
            navigate("/leases", { replace: true });
            return;
          }

          if (role === "admin") {
            navigate("/warehouses", { replace: true });
            return;
          }

          navigate("/", { replace: true });
        },
      }
    );
  };

  const handleResend = () => {
    console.log("Reenviar código");
  };

  return (
    <main className="min-h-screen bg-[#EEF1F4] px-4 py-8 md:flex md:items-center md:justify-center md:px-8 md:py-10">
      <div className="relative z-10 mx-auto w-full max-w-[1100px]">
        <div className="flex w-full flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_25px_60px_rgba(15,23,42,0.08)] md:min-h-[420px] md:flex-row">
          <div className="flex h-[220px] items-center justify-center border-b border-slate-200 bg-[#F7F7F8] p-8 md:h-auto md:min-h-full md:w-[44%] md:border-b-0 md:border-r">
            <img
              src={logo}
              alt="OneCube"
              className="w-[200px] object-contain md:w-[360px]"
            />
          </div>

          <div className="flex flex-1 items-center p-6 sm:p-7 md:p-10 lg:p-12">
            <div className="relative w-full overflow-hidden">
              <div
                key={step}
                className={`w-full animate-panel-in ${direction === "forward" ? "animate-from-right" : "animate-from-left"
                  }`}
              >
                {step === "verify" ? (
                  <VerifyStep
                    email={email}
                    code={code}
                    setCode={setCode}
                    onBack={handleBack}
                    onConfirm={handleConfirm}
                    onResend={handleResend}
                    isLoading={isValidating}
                    isResending={isRequesting}
                  />
                ) : (
                  <EmailStep
                    email={email}
                    setEmail={setEmail}
                    onContinue={handleContinue}
                    error={error}
                    isLoading={isRequesting}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}