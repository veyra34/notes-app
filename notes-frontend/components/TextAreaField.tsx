"use client";

import React, { useRef, useEffect } from "react";

type TextAreaFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  minHeight?: string;
  maxLength?: number;
};

export default function TextAreaField({
  value,
  onChange,
  placeholder = "Write something incredible...",
  label,
  minHeight = "min-h-[250px]",
  maxLength,
}: TextAreaFieldProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow height based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [value]);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {label}
        </label>
      )}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            if (maxLength && e.target.value.length > maxLength) return;
            onChange(e.target.value);
          }}
          placeholder={placeholder}
          className={`w-full bg-transparent border-0 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-0 resize-none text-base leading-relaxed py-1 ${minHeight}`}
        />
        {maxLength && (
          <div className="absolute bottom-2 right-2 text-[10px] text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-1.5 py-0.5 rounded-md pointer-events-none">
            {value.length} / {maxLength}
          </div>
        )}
      </div>
    </div>
  );
}
