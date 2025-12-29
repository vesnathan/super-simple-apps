import { createAuthStore } from "@super-simple-apps/shared-assets";

// Import amplify to ensure it's configured before any auth calls
import "@/lib/amplify";

// Invoice auth store - sync will be implemented similar to CRM
export const useAuthStore = createAuthStore({
  onSignIn: async (_user) => {
    // TODO: Sync local invoices to cloud
    console.log("[Invoice Auth] User signed in - cloud sync will be implemented");
  },
  onSignOut: async () => {
    console.log("[Invoice Auth] User signed out - local data preserved");
  },
});
