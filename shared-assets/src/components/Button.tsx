"use client";

import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
  size?: "icon" | "sm" | "md" | "lg";
  fullWidth?: boolean;
  children?: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = [
    "inline-flex items-center justify-center",
    "font-medium",
    "transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
  ].join(" ");

  const sizeStyles = {
    icon: "p-1.5",
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const variantStyles = {
    primary: disabled
      ? "bg-gray-400 text-white cursor-not-allowed"
      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg",
    secondary: disabled
      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
      : "bg-white border border-gray-200 hover:bg-gray-50 text-gray-700",
    outline: disabled
      ? "border border-gray-200 text-gray-400 cursor-not-allowed"
      : "bg-white border border-blue-200 hover:bg-blue-50 text-blue-600",
    ghost: disabled
      ? "text-gray-400 cursor-not-allowed"
      : "hover:bg-gray-100 text-gray-700",
    danger: disabled
      ? "bg-gray-400 text-white cursor-not-allowed"
      : "bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg",
    success: disabled
      ? "bg-gray-400 text-white cursor-not-allowed"
      : "bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
