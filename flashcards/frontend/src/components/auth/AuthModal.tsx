"use client";

/**
 * Authentication Modal Component
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
  Tabs,
  Tab,
  Input,
} from "@nextui-org/react";
import {
  EyeFilledIcon,
  EyeSlashFilledIcon,
} from "@/components/common/EyeIcons";
import {
  PasswordStrengthIndicator,
  usePasswordValidation,
} from "./PasswordStrengthIndicator";
import { ConfirmationModal } from "./ConfirmationModal";
import { useAuthStore } from "@/stores/authStore";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
}

export function AuthModal({
  isOpen,
  onClose,
  initialMode = "login",
}: AuthModalProps) {
  const [selectedTab, setSelectedTab] = useState<string>(initialMode);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Registration state
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);

  const { signIn, signUp, pendingConfirmation, setPendingConfirmation } =
    useAuthStore();

  const { isValid: isPasswordValid } = usePasswordValidation(registerPassword);

  const isLoginDisabled = !loginEmail || !loginPassword;
  const isRegisterDisabled =
    !registerEmail ||
    !registerPassword ||
    !confirmPassword ||
    !isPasswordValid ||
    registerPassword !== confirmPassword;

  const handleClose = () => {
    setSelectedTab(initialMode);
    setLoginError("");
    setRegisterError("");
    onClose();
  };

  const togglePasswordVisibility = () =>
    setIsPasswordVisible(!isPasswordVisible);
  const toggleConfirmPasswordVisibility = () =>
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);

  const handleLogin = async () => {
    setLoginError("");
    setLoginLoading(true);

    try {
      await signIn(loginEmail, loginPassword);
      handleClose();
      setLoginEmail("");
      setLoginPassword("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setLoginError(err.message);
      } else {
        setLoginError("An error occurred during sign in");
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async () => {
    if (registerPassword !== confirmPassword) {
      setRegisterError("Passwords do not match");
      return;
    }

    setRegisterError("");
    setRegisterLoading(true);

    try {
      await signUp(registerEmail, registerPassword);
      // signUp sets pendingConfirmation, which will open the confirmation modal
    } catch (err: unknown) {
      if (err instanceof Error) {
        setRegisterError(err.message);
      } else {
        setRegisterError("An error occurred during registration");
      }
      setRegisterLoading(false);
    }
  };

  const handleKeyDownLogin = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoginDisabled) {
      e.preventDefault();
      handleLogin();
    }
  };

  const handleKeyDownRegister = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isRegisterDisabled) {
      e.preventDefault();
      handleRegister();
    }
  };

  const renderLoginForm = () => (
    <div className="space-y-4">
      <Input
        label="Email address"
        type="email"
        variant="bordered"
        radius="sm"
        value={loginEmail}
        onChange={(e) => setLoginEmail(e.target.value)}
        onKeyDown={handleKeyDownLogin}
        isDisabled={loginLoading}
      />
      <Input
        label="Password"
        type={isPasswordVisible ? "text" : "password"}
        variant="bordered"
        radius="sm"
        value={loginPassword}
        onChange={(e) => setLoginPassword(e.target.value)}
        onKeyDown={handleKeyDownLogin}
        isDisabled={loginLoading}
        endContent={
          <button
            className="focus:outline-none flex items-center"
            type="button"
            onClick={togglePasswordVisibility}
          >
            {isPasswordVisible ? (
              <EyeFilledIcon className="w-5 h-5 text-gray-400" />
            ) : (
              <EyeSlashFilledIcon className="w-5 h-5 text-gray-400" />
            )}
          </button>
        }
      />
      {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
    </div>
  );

  const renderRegistrationForm = () => (
    <>
      <p className="text-gray-500 text-center mb-4">
        Create an account to save your flashcard decks
      </p>
      <div className="space-y-4">
        <Input
          label="Email address"
          type="email"
          variant="bordered"
          radius="sm"
          value={registerEmail}
          onChange={(e) => setRegisterEmail(e.target.value)}
          onKeyDown={handleKeyDownRegister}
          isDisabled={registerLoading}
        />
        <Input
          label="Password"
          type={isPasswordVisible ? "text" : "password"}
          variant="bordered"
          radius="sm"
          value={registerPassword}
          onChange={(e) => setRegisterPassword(e.target.value)}
          onKeyDown={handleKeyDownRegister}
          isDisabled={registerLoading}
          endContent={
            <button
              className="focus:outline-none flex items-center"
              type="button"
              onClick={togglePasswordVisibility}
            >
              {isPasswordVisible ? (
                <EyeFilledIcon className="w-5 h-5 text-gray-400" />
              ) : (
                <EyeSlashFilledIcon className="w-5 h-5 text-gray-400" />
              )}
            </button>
          }
        />
        <PasswordStrengthIndicator password={registerPassword} />
        <Input
          label="Confirm Password"
          type={isConfirmPasswordVisible ? "text" : "password"}
          variant="bordered"
          radius="sm"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onKeyDown={handleKeyDownRegister}
          isDisabled={registerLoading}
          endContent={
            <button
              className="focus:outline-none flex items-center"
              type="button"
              onClick={toggleConfirmPasswordVisibility}
            >
              {isConfirmPasswordVisible ? (
                <EyeFilledIcon className="w-5 h-5 text-gray-400" />
              ) : (
                <EyeSlashFilledIcon className="w-5 h-5 text-gray-400" />
              )}
            </button>
          }
        />
        {registerPassword &&
          confirmPassword &&
          registerPassword !== confirmPassword && (
            <p className="text-red-500 text-sm">Passwords do not match</p>
          )}
        {registerError && (
          <p className="text-red-500 text-sm">{registerError}</p>
        )}
      </div>
    </>
  );

  return (
    <>
      <Modal
        isOpen={isOpen && !pendingConfirmation}
        onClose={handleClose}
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
              <ModalHeader className="flex flex-col items-center gap-4 pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <svg
                      className="w-7 h-7 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Super Simple
                    </h2>
                    <p className="text-sm text-gray-500">Flashcard App</p>
                  </div>
                </div>
                <Tabs
                  selectedKey={selectedTab}
                  onSelectionChange={(key) => setSelectedTab(key as string)}
                  classNames={{
                    tabList: "bg-gray-100 p-1",
                    tab: "text-gray-600",
                    cursor: "bg-white shadow-sm",
                  }}
                >
                  <Tab key="login" title="Sign In" />
                  <Tab key="register" title="Register" />
                </Tabs>
              </ModalHeader>
              <ModalBody>
                {selectedTab === "login"
                  ? renderLoginForm()
                  : renderRegistrationForm()}
              </ModalBody>
              <ModalFooter className="flex flex-col gap-2">
                {selectedTab === "login" ? (
                  <Button
                    onPress={handleLogin}
                    isDisabled={isLoginDisabled}
                    isLoading={loginLoading}
                    className="w-full bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Sign In
                  </Button>
                ) : (
                  <Button
                    onPress={handleRegister}
                    isDisabled={isRegisterDisabled}
                    isLoading={registerLoading}
                    className="w-full bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Create Account
                  </Button>
                )}
                <Button
                  variant="bordered"
                  onPress={closeModal}
                  isDisabled={loginLoading || registerLoading}
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <ConfirmationModal
        email={pendingConfirmation || ""}
        isOpen={!!pendingConfirmation}
        password={registerPassword}
        onClose={() => {
          setPendingConfirmation(null);
          setRegisterLoading(false);
        }}
        onConfirmed={() => {
          setPendingConfirmation(null);
          setRegisterLoading(false);
          handleClose();
        }}
      />
    </>
  );
}
