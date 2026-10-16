import { useEffect, useRef } from "react";

const CODE_LENGTH = 6;

export default function CodeInput({ value, onChange }) {
  const refs = useRef([]);

  useEffect(() => {
    const firstEmptyIndex = value.findIndex((digit) => digit === "");
    const indexToFocus =
      firstEmptyIndex === -1 ? value.length - 1 : firstEmptyIndex;

    refs.current[indexToFocus]?.focus();
  }, [value]);

  const handleChange = (index, inputValue) => {
    const clean = inputValue.replace(/\D/g, "").slice(-1);
    const next = [...value];

    next[index] = clean;
    onChange(next);

    if (clean && index < CODE_LENGTH - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (value[index]) {
        const next = [...value];
        next[index] = "";
        onChange(next);
      } else if (index > 0) {
        refs.current[index - 1]?.focus();
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      refs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < CODE_LENGTH - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, CODE_LENGTH);

    if (!pasted) return;

    e.preventDefault();

    const next = Array(CODE_LENGTH).fill("");

    pasted.split("").forEach((char, i) => {
      next[i] = char;
    });

    onChange(next);
  };

  return (
    <div
      className="mt-2 grid w-full grid-cols-6 gap-1.5 sm:gap-2 md:gap-3"
      onPaste={handlePaste}
    >
      {value.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (refs.current[index] = el)}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          inputMode="numeric"
          maxLength={1}
          className="aspect-square w-full min-w-0 rounded-xl border border-slate-300 text-center text-xl font-bold text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:text-2xl md:text-3xl"
        />
      ))}
    </div>
  );
}