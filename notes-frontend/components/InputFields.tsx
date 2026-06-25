"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type InputFieldsProps = {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
  icon?: React.ReactNode;
  showPasswordToggle?: boolean;
};

export default function InputFields({
  label,
  placeholder,
  type,
  value,
  onChange,
  icon,
  showPasswordToggle,
}: InputFieldsProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-800">
        {label}
      </label>

      <div className="relative mt-2">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
            {icon}
          </div>
        )}

        <input
          type={
            showPasswordToggle
              ? showPassword
                ? "text"
                : "password"
              : type || "text"
          }
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-xl border border-gray-300 py-2 pl-12 pr-12 text-sm text-gray-900 placeholder:text-gray-500 outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
        />

        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </div>
  );
}