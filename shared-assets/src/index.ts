export { LandingTemplate } from "./components/LandingTemplate";
export type { LandingTemplateProps, FeatureItem } from "./components/LandingTemplate";
export { AppTemplate } from "./components/AppTemplate";
export type {
  AppTemplateProps,
  FeatureItem as AppFeatureItem,
  SidebarSection,
  SidebarAction,
} from "./components/AppTemplate";
export { MainLayout } from "./components/MainLayout";
export type { MainLayoutProps } from "./components/MainLayout";
export { WelcomeScreen } from "./components/WelcomeScreen";
export type { WelcomeScreenProps, WelcomeFeature, HowItWorksStep, UseCase } from "./components/WelcomeScreen";
export { Footer } from "./components/Footer";
export type { FooterProps } from "./components/Footer";
export { Button } from "./components/Button";
export type { ButtonProps } from "./components/Button";
export { AdBanner } from "./components/AdBanner";
export type { AdBannerProps } from "./components/AdBanner";
export { LocalStorageWarning } from "./components/LocalStorageWarning";
export type { LocalStorageWarningProps } from "./components/LocalStorageWarning";
export { LocalBadge } from "./components/LocalBadge";

// Auth exports
export {
  AuthModal,
  ConfirmationModal,
  PasswordStrengthIndicator,
  usePasswordValidation,
  EyeFilledIcon,
  EyeSlashFilledIcon,
  createAuthStore,
  useAuthStore,
  authService,
} from "./auth";
export type {
  AuthState,
  CognitoUser,
  ToastMessage,
  AuthStoreCallbacks,
} from "./auth";
