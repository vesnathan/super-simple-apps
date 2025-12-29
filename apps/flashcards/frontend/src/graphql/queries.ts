// Listing queries - minimal data for sidebar (cardCount instead of full cards array)
export const PUBLIC_DECKS = /* GraphQL */ `
  query PublicDecks {
    publicDecks {
      id
      userId
      title
      cardCount
      isPublic
      createdAt
      lastModified
    }
  }
`;

export const MY_DECKS = /* GraphQL */ `
  query MyDecks {
    myDecks {
      id
      userId
      title
      cardCount
      isPublic
      createdAt
      lastModified
    }
  }
`;

export const SEARCH_PUBLIC_DECKS = /* GraphQL */ `
  query SearchPublicDecks($search: String, $limit: Int, $nextToken: String) {
    searchPublicDecks(search: $search, limit: $limit, nextToken: $nextToken) {
      decks {
        id
        userId
        title
        description
        tags
        cardCount
        isPublic
        views
        createdAt
        lastModified
      }
      nextToken
    }
  }
`;

export const GET_DECK = /* GraphQL */ `
  query GetDeck($id: ID!) {
    getDeck(id: $id) {
      id
      userId
      title
      description
      tags
      cards {
        id
        question
        answer
        cardType
        options
        correctOptionIndex
        explanation
        imageUrl
        researchUrl
      }
      isPublic
      views
      createdAt
      lastModified
    }
  }
`;

export const POPULAR_DECKS = /* GraphQL */ `
  query PopularDecks($limit: Int) {
    popularDecks(limit: $limit) {
      id
      userId
      title
      description
      tags
      cardCount
      isPublic
      views
      createdAt
      lastModified
    }
  }
`;

export const GET_DECKS_BY_IDS = /* GraphQL */ `
  query GetDecksByIds($ids: [ID!]!) {
    getDecksByIds(ids: $ids) {
      id
      userId
      title
      description
      tags
      cardCount
      isPublic
      views
      createdAt
      lastModified
    }
  }
`;

export const PENDING_REPORTS = /* GraphQL */ `
  query PendingReports($limit: Int) {
    pendingReports(limit: $limit) {
      reports {
        id
        deckId
        cardId
        reason
        status
        createdAt
      }
      nextToken
    }
  }
`;
