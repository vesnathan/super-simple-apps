/**
 * GraphQL queries for CRM
 */

export const GET_CLIENT = /* GraphQL */ `
  query GetClient($id: ID!) {
    getClient(id: $id) {
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

export const LIST_CLIENTS = /* GraphQL */ `
  query ListClients($limit: Int, $nextToken: String) {
    listClients(limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
