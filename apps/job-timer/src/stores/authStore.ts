import { createAuthStore } from "@super-simple-apps/shared-assets";

// Import amplify to ensure it's configured before any auth calls
import "@/lib/amplify";

// Job Timer doesn't need any special callbacks on sign in/out
// so we use the default shared auth store
export const useAuthStore = createAuthStore();
