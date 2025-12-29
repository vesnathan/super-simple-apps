/* eslint-disable no-console */
import { createAuthStore, CognitoUser } from "@super-simple-apps/shared-assets";

import { useDeckStore } from "./deckStore";
import { queryClient, queryKeys } from "@/lib/queryClient";

// Import amplify to ensure it's configured before any auth calls
import "@/lib/amplify";

// Create flashcards-specific auth store with deck sync callbacks
export const useAuthStore = createAuthStore({
  onSignIn: async (_user: CognitoUser) => {
    // Invalidate all queries to refetch with new auth state
    queryClient.invalidateQueries({ queryKey: queryKeys.publicDecks });
    queryClient.invalidateQueries({ queryKey: queryKeys.userDecks });

    // Sync local decks after successful sign in
    const deckStore = useDeckStore.getState();

    await deckStore.syncLocalDecks();
    // Invalidate user decks again after sync to get latest
    queryClient.invalidateQueries({ queryKey: queryKeys.userDecks });
  },

  onSignOut: async () => {
    // Clear user decks when signing out
    useDeckStore.getState().clearUserDecks();

    // Invalidate all queries and clear cache
    queryClient.invalidateQueries({ queryKey: queryKeys.publicDecks });
    queryClient.removeQueries({ queryKey: queryKeys.userDecks });
  },
});
