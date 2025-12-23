"use client";

/**
 * Password Strength Indicator Component
 * Copied from The Story Hub - adapted for light theme
 */

import { useMemo } from "react";

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

type PasswordRequirement = {
  label: string;
  met: boolean;
};

type PasswordStrengthIndicatorProps = {
  password: string;
  showRequirements?: boolean;
};

const evaluatePassword = (
  password: string,
): {
  score: number;
  requirements: PasswordRequirement[];
} => {
  const requirements: PasswordRequirement[] = [
    {
      label: "At least 8 characters",
      met: password.length >= 8,
    },
    {
      label: "Contains uppercase letter",
      met: /[A-Z]/.test(password),
    },
    {
      label: "Contains lowercase letter",
      met: /[a-z]/.test(password),
    },
    {
      label: "Contains number",
      met: /[0-9]/.test(password),
    },
    {
      label: "Contains special character (!@#$%^&*)",
      met: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
    },
  ];

  const metCount = requirements.filter((r) => r.met).length;
  const score = Math.round((metCount / requirements.length) * 100);

  return { score, requirements };
};

const getStrengthLevel = (
  score: number,
): {
  label: string;
  color: string;
  textColor: string;
} => {
  if (score <= 20) {
    return {
      label: "Very Weak",
      color: "bg-red-500",
      textColor: "text-red-600",
    };
  }
  if (score <= 40) {
    return {
      label: "Weak",
      color: "bg-orange-500",
      textColor: "text-orange-600",
    };
  }
  if (score <= 60) {
    return {
      label: "Fair",
      color: "bg-yellow-500",
      textColor: "text-yellow-600",
    };
  }
  if (score <= 80) {
    return {
      label: "Good",
      color: "bg-lime-500",
      textColor: "text-lime-600",
    };
  }
  return {
    label: "Strong",
    color: "bg-green-500",
    textColor: "text-green-600",
  };
};

export const PasswordStrengthIndicator = ({
  password,
  showRequirements = true,
}: PasswordStrengthIndicatorProps) => {
  const { score, requirements } = useMemo(
    () => evaluatePassword(password),
    [password],
  );

  const strengthLevel = useMemo(() => getStrengthLevel(score), [score]);

  if (!password) {
    return null;
  }

  return (
    <div className="mt-2 space-y-3">
      {/* Strength bar */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Password strength</span>
          <span className={`text-xs font-medium ${strengthLevel.textColor}`}>
            {strengthLevel.label}
          </span>
        </div>
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${strengthLevel.color} transition-all duration-300`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* Requirements list */}
      {showRequirements && (
        <div className="space-y-1">
          <span className="text-xs text-gray-500">Requirements:</span>
          <ul className="space-y-1">
            {requirements.map((req) => (
              <li
                key={req.label}
                className={`flex items-center gap-2 text-xs ${
                  req.met ? "text-green-600" : "text-gray-400"
                }`}
              >
                {req.met ? (
                  <CheckIcon className="w-4 h-4 text-green-500" />
                ) : (
                  <XIcon className="w-4 h-4 text-gray-400" />
                )}
                {req.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export const usePasswordValidation = (password: string) => {
  return useMemo(() => {
    const { score, requirements } = evaluatePassword(password);
    const allRequirementsMet = requirements.every((r) => r.met);
    return {
      isValid: allRequirementsMet,
      score,
      requirements,
    };
  }, [password]);
};
