"use client";

/**
 * Email Confirmation Modal Component
 * Using NextUI components like The Story Hub
 */

import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { useAuthStore } from "@/stores/authStore";
import { authService } from "@/services/auth";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  password: string;
  onConfirmed: () => void;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  email,
  password,
  onConfirmed,
}: ConfirmationModalProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuthStore();

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
      classNames={{
        wrapper: "md:pl-64",
        backdrop: "bg-black/50",
        base: "bg-white border border-gray-200",
        header: "border-b border-gray-100",
        body: "py-6",
        footer: "border-t border-gray-100",
      }}
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
                onPress={handleSubmit}
                isDisabled={!code || loading}
                isLoading={loading}
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
              >
                Confirm
              </Button>
              <Button
                variant="bordered"
                onPress={closeModal}
                isDisabled={loading}
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
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
