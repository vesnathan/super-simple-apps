/**
 * GraphQL mutations for CRM
 */

export const CREATE_CLIENT = /* GraphQL */ `
  mutation CreateClient($input: CreateClientInput!) {
    createClient(input: $input) {
      id
      userId
      name
      email
      phone
      company
      address
      notes
      tags
      hourlyRate
      createdAt
      updatedAt
      syncedAt
    }
  }
`;

export const UPDATE_CLIENT = /* GraphQL */ `
  mutation UpdateClient($input: UpdateClientInput!) {
    updateClient(input: $input) {
      id
      userId
      name
      email
      phone
      company
      address
      notes
      tags
      hourlyRate
      createdAt
      updatedAt
      syncedAt
    }
  }
`;

export const DELETE_CLIENT = /* GraphQL */ `
  mutation DeleteClient($id: ID!) {
    deleteClient(id: $id)
  }
`;

export const SYNC_CLIENTS = /* GraphQL */ `
  mutation SyncClients($input: SyncClientsInput!) {
    syncClients(input: $input) {
      synced
      clients {
        id
        userId
        name
        email
        phone
        company
        address
        notes
        tags
        hourlyRate
        createdAt
        updatedAt
        syncedAt
      }
    }
  }
`;
