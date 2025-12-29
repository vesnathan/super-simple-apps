export const CREATE_INVOICE = /* GraphQL */ `
  mutation CreateInvoice($input: CreateInvoiceInput!) {
    createInvoice(input: $input) {
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

export const UPDATE_INVOICE = /* GraphQL */ `
  mutation UpdateInvoice($input: UpdateInvoiceInput!) {
    updateInvoice(input: $input) {
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

export const DELETE_INVOICE = /* GraphQL */ `
  mutation DeleteInvoice($id: ID!) {
    deleteInvoice(id: $id)
  }
`;

export const SYNC_INVOICES = /* GraphQL */ `
  mutation SyncInvoices($invoices: [SyncInvoiceInput!]!) {
    syncInvoices(invoices: $invoices) {
      synced
      failed
      invoices {
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
  }
`;
