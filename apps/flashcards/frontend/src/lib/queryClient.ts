import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Query keys for invalidation
export const queryKeys = {
  publicDecks: ["publicDecks"] as const,
  userDecks: ["userDecks"] as const,
  all: ["decks"] as const,
};
