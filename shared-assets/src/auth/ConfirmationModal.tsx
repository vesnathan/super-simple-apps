"use client";

/**
 * Email Confirmation Modal Component
 */

import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "@nextui-org/react";

import { Button } from "../components/Button";
import { authService } from "./authService";
import type { AuthState } from "./authStore";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  password: string;
  onConfirmed: () => void;
  useAuthStore: () => AuthState;
  modalClassNames?: {
    wrapper?: string;
    backdrop?: string;
    base?: string;
    header?: string;
    body?: string;
    footer?: string;
  };
}

export function ConfirmationModal({
  isOpen,
  onClose,
  email,
  password,
  onConfirmed,
  useAuthStore,
  modalClassNames,
}: ConfirmationModalProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuthStore();

  const defaultModalClassNames = {
    wrapper: "z-[100] md:pl-64",
    backdrop: "z-[99] bg-black/50 backdrop-blur-sm",
    base: "z-[100] bg-white border border-gray-200",
    header: "border-b border-gray-100",
    body: "py-6",
    footer: "border-t border-gray-100",
  };

  const mergedClassNames = { ...defaultModalClassNames, ...modalClassNames };

  const handleSubmit = async () => {
    if (!code) return;

    setError("");
    setLoading(true);

    try {
      await authService.confirmSignUp(email, code);
      // Auto login after confirmation using passed password
      await signIn(email, password);
      onConfirmed();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to confirm registration");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && code) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      hideCloseButton
      classNames={mergedClassNames}
    >
      <ModalContent>
        {(closeModal) => (
          <>
            <ModalHeader className="flex flex-col items-center gap-2 pt-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-2">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Confirm your email
              </h2>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <p className="text-gray-500 text-center text-sm">
                  We sent a confirmation code to{" "}
                  <span className="font-medium text-gray-700">{email}</span>
                </p>
                <Input
                  label="Confirmation Code"
                  type="text"
                  variant="bordered"
                  radius="sm"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={handleKeyDown}
                  isDisabled={loading}
                  placeholder="Enter 6-digit code"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <p className="text-xs text-gray-400 text-center">
                  Didn't receive the code? Check your spam folder.
                </p>
              </div>
            </ModalBody>
            <ModalFooter className="flex flex-col gap-2">
              <Button
                onClick={handleSubmit}
                disabled={!code || loading}
                variant="primary"
                fullWidth
              >
                {loading ? "Confirming..." : "Confirm"}
              </Button>
              <Button
                variant="secondary"
                onClick={closeModal}
                disabled={loading}
                fullWidth
              >
                Cancel
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
