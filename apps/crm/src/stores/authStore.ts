import { createAuthStore } from "@super-simple-apps/shared-assets";

// Import amplify to ensure it's configured before any auth calls
import "@/lib/amplify";

// Import sync service
import { syncOnSignIn, handleSignOut } from "@/services/syncService";

// CRM auth store with cloud sync callbacks
export const useAuthStore = createAuthStore({
  onSignIn: async (_user) => {
    try {
      console.log("[CRM Auth] User signed in - starting cloud sync...");
      const result = await syncOnSignIn();
      console.log(`[CRM Auth] Sync complete: ${result.synced} synced, ${result.merged} total clients`);

      // Reload the page to pick up the merged data
      // This is a simple approach - a more sophisticated one would use React context
      window.location.reload();
    } catch (error) {
      console.error("[CRM Auth] Cloud sync failed:", error);
      // Don't throw - let the user continue with local data
    }
  },
  onSignOut: async () => {
    await handleSignOut();
    console.log("[CRM Auth] User signed out - local data preserved");
  },
});
