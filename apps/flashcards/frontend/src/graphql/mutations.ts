export const CREATE_DECK = /* GraphQL */ `
  mutation CreateDeck($input: CreateDeckInput!) {
    createDeck(input: $input) {
      id
      userId
      title
      cards {
        id
        question
        answer
      }
      isPublic
      createdAt
      lastModified
    }
  }
`;

export const SYNC_DECKS = /* GraphQL */ `
  mutation SyncDecks($decks: [SyncDeckInput!]!) {
    syncDecks(decks: $decks) {
      success
      syncedCount
    }
  }
`;

export const UPDATE_CARD = /* GraphQL */ `
  mutation UpdateCard($deckId: ID!, $cardId: ID!, $input: UpdateCardInput!) {
    updateCard(deckId: $deckId, cardId: $cardId, input: $input) {
      id
      userId
      title
      cards {
        id
        question
        answer
      }
      isPublic
      createdAt
      lastModified
    }
  }
`;

export const UPDATE_DECK = /* GraphQL */ `
  mutation UpdateDeck($deckId: ID!, $input: UpdateDeckInput!) {
    updateDeck(deckId: $deckId, input: $input) {
      id
      userId
      title
      cards {
        id
        question
        answer
      }
      isPublic
      createdAt
      lastModified
    }
  }
`;

export const DELETE_DECK = /* GraphQL */ `
  mutation DeleteDeck($deckId: ID!) {
    deleteDeck(deckId: $deckId) {
      success
      deletedId
    }
  }
`;

export const INCREMENT_DECK_VIEWS = /* GraphQL */ `
  mutation IncrementDeckViews($deckId: ID!) {
    incrementDeckViews(deckId: $deckId) {
      success
      views
    }
  }
`;

export const REPORT_CARD = /* GraphQL */ `
  mutation ReportCard($input: ReportCardInput!) {
    reportCard(input: $input) {
      success
    }
  }
`;

export const UPDATE_REPORT_STATUS = /* GraphQL */ `
  mutation UpdateReportStatus($reportId: ID!, $deckId: ID!, $cardId: ID!, $status: String!) {
    updateReportStatus(reportId: $reportId, deckId: $deckId, cardId: $cardId, status: $status) {
      success
      report {
        id
        deckId
        cardId
        reason
        status
        createdAt
      }
    }
  }
`;
