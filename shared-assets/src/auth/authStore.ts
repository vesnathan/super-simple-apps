/* eslint-disable no-console */
import { create, StateCreator } from "zustand";
import { signOut, getCurrentUser } from "aws-amplify/auth";
import { Cache } from "aws-amplify/utils";

import { authService } from "./authService";

export interface CognitoUser {
  userId: string;
  username: string;
  signInDetails?: {
    loginId?: string;
    authFlowType?: string;
  };
}

export interface ToastMessage {
  message: string;
  type: "success" | "error" | "info";
}

export interface AuthState {
  user: CognitoUser | null;
  loading: boolean;
  error: string | null;
  isLoggedIn: boolean;
  pendingConfirmation: string | null;
  toastMessage: ToastMessage | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setPendingConfirmation: (email: string | null) => void;
  showToast: (message: string, type: "success" | "error" | "info") => void;
}

export interface AuthStoreCallbacks {
  onSignIn?: (user: CognitoUser) => Promise<void>;
  onSignOut?: () => Promise<void>;
}

/**
 * Creates an auth store with optional app-specific callbacks.
 * This allows each app to extend the base auth behavior with their own logic.
 *
 * @example
 * // In flashcards app:
 * export const useAuthStore = createAuthStore({
 *   onSignIn: async (user) => {
 *     await useDeckStore.getState().syncLocalDecks();
 *   },
 *   onSignOut: async () => {
 *     useDeckStore.getState().clearUserDecks();
 *   },
 * });
 *
 * // In job-timer app (no extra callbacks needed):
 * export const useAuthStore = createAuthStore();
 */
export function createAuthStore(callbacks?: AuthStoreCallbacks) {
  const storeCreator: StateCreator<AuthState> = (set) => ({
    user: null,
    loading: true,
    error: null,
    isLoggedIn: false,
    pendingConfirmation: null,
    toastMessage: null,

    checkAuth: async () => {
      try {
        const currentUser = await getCurrentUser();
        const user: CognitoUser = {
          userId: currentUser.userId || currentUser.username,
          username: currentUser.username,
          signInDetails: currentUser.signInDetails,
        };

        set({ user, loading: false, isLoggedIn: true });
      } catch {
        // Clear tokens if not authenticated
        await Cache.clear();
        localStorage.removeItem("lastAuthUser");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("idToken");
        localStorage.removeItem("refreshToken");

        set({ user: null, loading: false, isLoggedIn: false });
      }
    },

    signIn: async (email, password) => {
      try {
        set({ user: null, error: null });
        await authService.signIn(email, password);
        const currentUser = await authService.getCurrentUser();

        // Extract user ID from Cognito user
        const user: CognitoUser = {
          userId: currentUser.userId || currentUser.username,
          username: currentUser.username,
          signInDetails: currentUser.signInDetails,
        };

        set({ user, error: null, isLoggedIn: true });

        // Run app-specific onSignIn callback
        if (callbacks?.onSignIn) {
          try {
            await callbacks.onSignIn(user);
            set({
              toastMessage: {
                message: "Successfully signed in",
                type: "success",
              },
            });
          } catch (callbackError) {
            console.error("Error in onSignIn callback:", callbackError);
            set({
              toastMessage: {
                message: "Signed in, but some data may not have synced",
                type: "error",
              },
            });
          }
        } else {
          set({
            toastMessage: {
              message: "Successfully signed in",
              type: "success",
            },
          });
        }

        // Clear toast after 3 seconds
        setTimeout(() => {
          set({ toastMessage: null });
        }, 3000);
      } catch (error: unknown) {
        console.error("Sign in error:", error);
        const message =
          error instanceof Error
            ? error.message
            : "An error occurred during sign in";
        set({ error: message, user: null, isLoggedIn: false });
        throw error;
      }
    },

    signUp: async (email, password) => {
      try {
        await authService.signUp(email, password);
        set({ error: null, pendingConfirmation: email });
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : "An error occurred during sign up";
        set({ error: message });
        throw error;
      }
    },

    signOut: async () => {
      try {
        await signOut();
        // Clear Amplify cache
        await Cache.clear();

        // Clear any local storage items related to auth
        localStorage.removeItem("lastAuthUser");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("idToken");
        localStorage.removeItem("refreshToken");

        // Run app-specific onSignOut callback
        if (callbacks?.onSignOut) {
          try {
            await callbacks.onSignOut();
          } catch (callbackError) {
            console.error("Error in onSignOut callback:", callbackError);
          }
        }

        set({ user: null, error: null, isLoggedIn: false });
      } catch (error: unknown) {
        console.error("Sign out error:", error);
        const message =
          error instanceof Error
            ? error.message
            : "An error occurred during sign out";
        set({ error: message });
        throw error;
      }
    },

    setPendingConfirmation: (email) => set({ pendingConfirmation: email }),

    showToast: (message: string, type: "success" | "error" | "info") => {
      set({ toastMessage: { message, type } });
      // Clear toast after 3 seconds
      setTimeout(() => {
        set({ toastMessage: null });
      }, 3000);
    },
  });

  return create<AuthState>(storeCreator);
}

// Export a default store for simple apps that don't need callbacks
export const useAuthStore = createAuthStore();
