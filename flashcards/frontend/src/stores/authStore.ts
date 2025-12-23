/* eslint-disable no-console */
import { create } from "zustand";
import { signOut, getCurrentUser } from "aws-amplify/auth";
import { Cache } from "aws-amplify/utils";

import { useDeckStore } from "./deckStore";
import { queryClient, queryKeys } from "@/lib/queryClient";

import { authService } from "@/services/auth";

interface CognitoUser {
  userId: string;
  username: string;
  signInDetails?: {
    loginId?: string;
    authFlowType?: string;
  };
}

interface AuthState {
  user: CognitoUser | null;
  loading: boolean;
  error: string | null;
  isLoggedIn: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
  pendingConfirmation: string | null;
  setPendingConfirmation: (email: string | null) => void;
  showToast: (message: string, type: "success" | "error" | "info") => void;
  toastMessage: { message: string; type: "success" | "error" | "info" } | null;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,
  isLoggedIn: false, // Add this
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

      // Invalidate all queries to refetch with new auth state
      queryClient.invalidateQueries({ queryKey: queryKeys.publicDecks });
      queryClient.invalidateQueries({ queryKey: queryKeys.userDecks });

      // Sync local decks after successful sign in
      const deckStore = useDeckStore.getState();

      try {
        await deckStore.syncLocalDecks();
        // Invalidate user decks again after sync to get latest
        queryClient.invalidateQueries({ queryKey: queryKeys.userDecks });

        set((state) => ({
          ...state,
          toastMessage: {
            message: "Successfully signed in",
            type: "success",
          },
        }));
      } catch (deckError) {
        console.error("Failed to sync decks after sign in:", deckError);
        set((state) => ({
          ...state,
          toastMessage: {
            message: "Signed in, but failed to sync decks",
            type: "error",
          },
        }));
      }
    } catch (error: unknown) {
      console.error("Sign in error:", error);
      const message = error instanceof Error ? error.message : "An error occurred during sign in";
      set({ error: message, user: null, isLoggedIn: false });
      throw error;
    }
  },

  signUp: async (email, password) => {
    try {
      await authService.signUp(email, password);
      set({ error: null, pendingConfirmation: email });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An error occurred during sign up";
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

      // Clear user decks when signing out
      useDeckStore.getState().clearUserDecks();

      // Invalidate all queries and clear cache
      queryClient.invalidateQueries({ queryKey: queryKeys.publicDecks });
      queryClient.removeQueries({ queryKey: queryKeys.userDecks });

      set({ user: null, error: null, isLoggedIn: false });
    } catch (error: unknown) {
      console.error("Sign out error:", error);
      const message = error instanceof Error ? error.message : "An error occurred during sign out";
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
}));
