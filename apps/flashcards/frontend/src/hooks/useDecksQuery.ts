import { useQuery, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { deckService } from "@/services/api";
import { queryKeys } from "@/lib/queryClient";
import { useAuthStore } from "@/stores/authStore";

export function usePublicDecksQuery(search?: string, enabled: boolean = true) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return useInfiniteQuery({
    // Include isLoggedIn in query key so it refetches when auth state changes
    queryKey: [...queryKeys.publicDecks, search ?? "", isLoggedIn],
    queryFn: async ({ pageParam }) => {
      return deckService.searchPublicDecks(search, 10, pageParam, isLoggedIn);
    },
    getNextPageParam: (lastPage) => lastPage.nextToken ?? undefined,
    initialPageParam: undefined as string | undefined,
    enabled,
  });
}

export function useUserDecksQuery() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return useQuery({
    queryKey: queryKeys.userDecks,
    queryFn: () => deckService.getUserDecks(),
    enabled: isLoggedIn,
  });
}

export function usePopularDecksQuery(limit: number = 5) {
  return useQuery({
    queryKey: [...queryKeys.publicDecks, "popular", limit],
    queryFn: () => deckService.getPopularDecks(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useInvalidateDecks() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.publicDecks });
      queryClient.invalidateQueries({ queryKey: queryKeys.userDecks });
    },
    invalidatePublic: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.publicDecks });
    },
    invalidateUser: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.userDecks });
    },
  };
}
