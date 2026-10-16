import { useEffect, useRef } from "react";

export default function PinInput({
  length = 6,
  value,
  onChange,
  autoFocus = true,
}) {
  const refs = useRef([]);

  useEffect(() => {
    if (!autoFocus) return;
    const firstEmptyIndex = value.findIndex((digit) => digit === "");
    const indexToFocus = firstEmptyIndex === -1 ? value.length - 1 : firstEmptyIndex;
    refs.current[indexToFocus]?.focus();
  }, [value, autoFocus]);

  const handleChange = (index, inputValue) => {
    const clean = inputValue.replace(/\D/g, "").slice(-1);
    const next = [...value];
    next[index] = clean;
    onChange(next);

    if (clean && index < length - 1) {
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

    if (e.key === "ArrowLeft" && index > 0) refs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < length - 1) refs.current[index + 1]?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;

    e.preventDefault();
    const next = Array(length).fill("");
    pasted.split("").forEach((char, i) => {
      next[i] = char;
    });
    onChange(next);
  };

  return (
    <div className="mt-2 flex justify-between gap-2 sm:gap-3" onPaste={handlePaste}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (refs.current[index] = el)}
          value={value[index] ?? ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          inputMode="numeric"
          maxLength={1}
          className="h-12 w-11 rounded-xl border border-slate-300 text-center text-2xl font-bold text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:h-14 sm:w-12 md:h-16 md:w-14"
        />
      ))}
    </div>
  );
}