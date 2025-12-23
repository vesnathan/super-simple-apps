export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  AWSDateTime: { input: string; output: string; }
  AWSTimestamp: { input: number; output: number; }
};

export type Card = {
  answer: Scalars['String']['output'];
  cardType?: Maybe<Scalars['String']['output']>;
  correctOptionIndex?: Maybe<Scalars['Int']['output']>;
  explanation?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  options?: Maybe<Array<Scalars['String']['output']>>;
  question: Scalars['String']['output'];
  researchUrl?: Maybe<Scalars['String']['output']>;
};

export type CardInput = {
  answer: Scalars['String']['input'];
  cardType?: InputMaybe<Scalars['String']['input']>;
  correctOptionIndex?: InputMaybe<Scalars['Int']['input']>;
  explanation?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  options?: InputMaybe<Array<Scalars['String']['input']>>;
  question: Scalars['String']['input'];
  researchUrl?: InputMaybe<Scalars['String']['input']>;
};

export type CreateDeckInput = {
  cards?: InputMaybe<Array<CardInput>>;
  id: Scalars['ID']['input'];
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
  title: Scalars['String']['input'];
};

export type Deck = {
  cardCount: Scalars['Int']['output'];
  cards: Array<Card>;
  createdAt: Scalars['AWSDateTime']['output'];
  id: Scalars['ID']['output'];
  isPublic: Scalars['Boolean']['output'];
  lastModified: Scalars['AWSTimestamp']['output'];
  title: Scalars['String']['output'];
  userId: Scalars['ID']['output'];
};

export type DeleteDeckResult = {
  deletedId: Scalars['ID']['output'];
  success: Scalars['Boolean']['output'];
};

export type Mutation = {
  createDeck: Deck;
  deleteDeck: DeleteDeckResult;
  syncDecks: SyncResult;
  updateCard: Deck;
  updateDeck: Deck;
};


export type MutationCreateDeckArgs = {
  input: CreateDeckInput;
};


export type MutationDeleteDeckArgs = {
  deckId: Scalars['ID']['input'];
};


export type MutationSyncDecksArgs = {
  decks: Array<SyncDeckInput>;
};


export type MutationUpdateCardArgs = {
  cardId: Scalars['ID']['input'];
  deckId: Scalars['ID']['input'];
  input: UpdateCardInput;
};


export type MutationUpdateDeckArgs = {
  deckId: Scalars['ID']['input'];
  input: UpdateDeckInput;
};

export type PublicDecksResult = {
  decks: Array<Deck>;
  nextToken?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  getDeck?: Maybe<Deck>;
  myDecks: Array<Deck>;
  publicDecks: Array<Deck>;
  searchPublicDecks: PublicDecksResult;
};


export type QueryGetDeckArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySearchPublicDecksArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type SyncDeckInput = {
  cards: Array<CardInput>;
  createdAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
  id: Scalars['ID']['input'];
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
  lastModified?: InputMaybe<Scalars['AWSTimestamp']['input']>;
  title: Scalars['String']['input'];
};

export type SyncResult = {
  success: Scalars['Boolean']['output'];
  syncedCount: Scalars['Int']['output'];
};

export type UpdateCardInput = {
  answer?: InputMaybe<Scalars['String']['input']>;
  cardType?: InputMaybe<Scalars['String']['input']>;
  correctOptionIndex?: InputMaybe<Scalars['Int']['input']>;
  explanation?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  options?: InputMaybe<Array<Scalars['String']['input']>>;
  question?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateDeckInput = {
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};
