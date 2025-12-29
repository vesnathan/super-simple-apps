"use client";

/**
 * Authentication Modal Component
 */

import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tabs,
  Tab,
  Input,
} from "@nextui-org/react";

import { Button } from "../components/Button";
import { EyeFilledIcon, EyeSlashFilledIcon } from "./EyeIcons";
import {
  PasswordStrengthIndicator,
  usePasswordValidation,
} from "./PasswordStrengthIndicator";
import { ConfirmationModal } from "./ConfirmationModal";
import type { AuthState } from "./authStore";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
  useAuthStore: () => AuthState;
  appName: string;
  appSubtitle?: string;
  appIcon?: React.ReactNode;
  registrationMessage?: string;
  modalClassNames?: {
    wrapper?: string;
    backdrop?: string;
    base?: string;
    header?: string;
    body?: string;
    footer?: string;
  };
}

const DefaultAppIcon = () => (
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
);

export function AuthModal({
  isOpen,
  onClose,
  initialMode = "login",
  useAuthStore,
  appName,
  appSubtitle,
  appIcon,
  registrationMessage = "Create an account to save your data",
  modalClassNames,
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

  const defaultModalClassNames = {
    wrapper: "z-[100] md:pl-64",
    backdrop: "z-[99] bg-black/50 backdrop-blur-sm",
    base: "z-[100] bg-white border border-gray-200",
    header: "border-b border-gray-100",
    body: "py-6",
    footer: "border-t border-gray-100",
  };

  const mergedClassNames = { ...defaultModalClassNames, ...modalClassNames };

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
      <p className="text-gray-500 text-center mb-4">{registrationMessage}</p>
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
        classNames={mergedClassNames}
      >
        <ModalContent>
          {(closeModal) => (
            <>
              <ModalHeader className="flex flex-col items-center gap-4 pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    {appIcon || <DefaultAppIcon />}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {appName}
                    </h2>
                    {appSubtitle && (
                      <p className="text-sm text-gray-500">{appSubtitle}</p>
                    )}
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
                    onClick={handleLogin}
                    disabled={isLoginDisabled}
                    variant="primary"
                    fullWidth
                  >
                    {loginLoading ? "Signing in..." : "Sign In"}
                  </Button>
                ) : (
                  <Button
                    onClick={handleRegister}
                    disabled={isRegisterDisabled}
                    variant="primary"
                    fullWidth
                  >
                    {registerLoading ? "Creating..." : "Create Account"}
                  </Button>
                )}
                <Button
                  variant="secondary"
                  onClick={closeModal}
                  disabled={loginLoading || registerLoading}
                  fullWidth
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
        useAuthStore={useAuthStore}
        modalClassNames={modalClassNames}
      />
    </>
  );
}
