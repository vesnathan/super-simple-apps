// Re-export shared auth service
// Import amplify to ensure it's configured before any auth calls
import "@/lib/amplify";

export { authService } from "@super-simple-apps/shared-assets";
