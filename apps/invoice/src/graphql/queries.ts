export const GET_INVOICE = /* GraphQL */ `
  query GetInvoice($id: ID!) {
    getInvoice(id: $id) {
      id
      invoiceNumber
      clientId
      clientName
      clientEmail
      clientAddress
      issueDate
      dueDate
      status
      lineItems {
        id
        description
        quantity
        unitPrice
        amount
        timerSessionId
      }
      subtotal
      taxRate
      taxAmount
      total
      notes
      paymentTerms
      userId
      createdAt
      updatedAt
      syncedAt
      sentAt
      viewedAt
      paidAt
    }
  }
`;

export const LIST_INVOICES = /* GraphQL */ `
  query ListInvoices($limit: Int, $nextToken: String) {
    listInvoices(limit: $limit, nextToken: $nextToken) {
      items {
        id
        invoiceNumber
        clientId
        clientName
        clientEmail
        clientAddress
        issueDate
        dueDate
        status
        lineItems {
          id
          description
          quantity
          unitPrice
          amount
          timerSessionId
        }
        subtotal
        taxRate
        taxAmount
        total
        notes
        paymentTerms
        userId
        createdAt
        updatedAt
        syncedAt
        sentAt
        viewedAt
        paidAt
      }
      nextToken
    }
  }
`;
