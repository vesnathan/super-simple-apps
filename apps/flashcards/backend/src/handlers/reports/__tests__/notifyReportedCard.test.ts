import { describe, it, expect, beforeEach, vi } from "vitest";

/**
 * Tests for notifyReportedCard Lambda function
 *
 * This Lambda is triggered by DynamoDB Streams when a new report is inserted.
 * It sends email notifications to the admin for all reported cards.
 */

// Mock AWS SDK - DynamoDB
vi.mock("@aws-sdk/client-dynamodb", () => {
  const mockSendFn = vi.fn();
  return {
    DynamoDBClient: vi.fn(() => ({
      send: mockSendFn,
    })),
    GetItemCommand: vi.fn((params) => ({ _type: "GetItem", ...params })),
    __mockDynamoSend: mockSendFn,
  };
});

// Mock AWS SDK - SES
vi.mock("@aws-sdk/client-ses", () => {
  const mockSendFn = vi.fn();
  return {
    SESClient: vi.fn(() => ({
      send: mockSendFn,
    })),
    SendEmailCommand: vi.fn((params) => ({ _type: "SendEmail", ...params })),
    __mockSesSend: mockSendFn,
  };
});

// Mock unmarshall from util
vi.mock("@aws-sdk/util-dynamodb", () => ({
  unmarshall: vi.fn((item) => {
    // Simple unmarshalling for test data
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(item)) {
      const typedValue = value as Record<string, unknown>;
      if (typedValue.S !== undefined) result[key] = typedValue.S;
      else if (typedValue.N !== undefined) result[key] = Number(typedValue.N);
      else if (typedValue.BOOL !== undefined) result[key] = typedValue.BOOL;
      else if (typedValue.L !== undefined) {
        // Handle list type
        result[key] = (typedValue.L as Array<Record<string, unknown>>).map(
          (item) => {
            if (item.M) {
              const mapResult: Record<string, unknown> = {};
              for (const [k, v] of Object.entries(
                item.M as Record<string, Record<string, unknown>>
              )) {
                if (v.S !== undefined) mapResult[k] = v.S;
                else if (v.N !== undefined) mapResult[k] = Number(v.N);
              }
              return mapResult;
            }
            return item;
          }
        );
      } else if (typedValue.M !== undefined) {
        const mapResult: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(
          typedValue.M as Record<string, Record<string, unknown>>
        )) {
          if (v.S !== undefined) mapResult[k] = v.S;
          else if (v.N !== undefined) mapResult[k] = Number(v.N);
        }
        result[key] = mapResult;
      } else {
        result[key] = value;
      }
    }
    return result;
  }),
}));

import { handler } from "../notifyReportedCard";
import * as dynamoModule from "@aws-sdk/client-dynamodb";
import * as sesModule from "@aws-sdk/client-ses";
import type { DynamoDBStreamEvent, DynamoDBRecord } from "aws-lambda";

const mockedDynamoModule = dynamoModule as typeof dynamoModule & {
  __mockDynamoSend: ReturnType<typeof vi.fn>;
};
const mockDynamoSend = mockedDynamoModule.__mockDynamoSend;

const mockedSesModule = sesModule as typeof sesModule & {
  __mockSesSend: ReturnType<typeof vi.fn>;
};
const mockSesSend = mockedSesModule.__mockSesSend;

// Test data factories
function createReportRecord(overrides: Partial<DynamoDBRecord> = {}): DynamoDBRecord {
  return {
    eventName: "INSERT",
    dynamodb: {
      NewImage: {
        id: { S: "report-123" },
        deckId: { S: "deck-456" },
        cardId: { S: "card-789" },
        reason: { S: "Incorrect answer" },
        createdAt: { S: "2025-01-01T00:00:00Z" },
        status: { S: "pending" },
        reporterId: { S: "user-abc" },
      },
    },
    ...overrides,
  } as DynamoDBRecord;
}

function createDeckItem(overrides: Record<string, unknown> = {}) {
  return {
    Item: {
      id: { S: "deck-456" },
      userId: { S: "user-owner" },
      title: { S: "Test Deck" },
      cards: {
        L: [
          {
            M: {
              id: { S: "card-789" },
              question: { S: "What is 2+2?" },
              answer: { S: "4" },
            },
          },
          {
            M: {
              id: { S: "card-other" },
              question: { S: "Other question" },
              answer: { S: "Other answer" },
            },
          },
        ],
      },
      ...overrides,
    },
  };
}

function createSystemDeckItem() {
  return createDeckItem({ userId: { S: "system" } });
}

describe("notifyReportedCard Lambda", () => {
  beforeEach(() => {
    mockDynamoSend.mockClear();
    mockSesSend.mockClear();
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  describe("Event filtering", () => {
    it("should only process INSERT events", async () => {
      const event: DynamoDBStreamEvent = {
        Records: [
          createReportRecord({ eventName: "MODIFY" }),
          createReportRecord({ eventName: "REMOVE" }),
        ],
      };

      await handler(event);

      expect(mockDynamoSend).not.toHaveBeenCalled();
      expect(mockSesSend).not.toHaveBeenCalled();
    });

    it("should process INSERT events", async () => {
      mockDynamoSend.mockResolvedValueOnce(createDeckItem());
      mockSesSend.mockResolvedValueOnce({});

      const event: DynamoDBStreamEvent = {
        Records: [createReportRecord()],
      };

      await handler(event);

      expect(mockDynamoSend).toHaveBeenCalledTimes(1);
      expect(mockSesSend).toHaveBeenCalledTimes(1);
    });

    it("should skip records without NewImage", async () => {
      const event: DynamoDBStreamEvent = {
        Records: [
          {
            eventName: "INSERT",
            dynamodb: {},
          } as DynamoDBRecord,
        ],
      };

      await handler(event);

      expect(mockDynamoSend).not.toHaveBeenCalled();
      expect(mockSesSend).not.toHaveBeenCalled();
      expect(console.warn).toHaveBeenCalledWith("No NewImage in record");
    });
  });

  describe("Deck lookup", () => {
    it("should fetch deck details from DynamoDB", async () => {
      mockDynamoSend.mockResolvedValueOnce(createDeckItem());
      mockSesSend.mockResolvedValueOnce({});

      const event: DynamoDBStreamEvent = {
        Records: [createReportRecord()],
      };

      await handler(event);

      expect(mockDynamoSend).toHaveBeenCalledWith(
        expect.objectContaining({
          _type: "GetItem",
          TableName: "test-table",
          Key: {
            PK: { S: "DECK#deck-456" },
            SK: { S: "DECK#deck-456" },
          },
        })
      );
    });

    it("should handle missing deck gracefully", async () => {
      mockDynamoSend.mockResolvedValueOnce({ Item: undefined });

      const event: DynamoDBStreamEvent = {
        Records: [createReportRecord()],
      };

      await handler(event);

      expect(mockSesSend).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith("Deck not found: deck-456");
    });
  });

  describe("Email notifications", () => {
    it("should send email to admin for system deck reports", async () => {
      mockDynamoSend.mockResolvedValueOnce(createSystemDeckItem());
      mockSesSend.mockResolvedValueOnce({});

      const event: DynamoDBStreamEvent = {
        Records: [createReportRecord()],
      };

      await handler(event);

      expect(mockSesSend).toHaveBeenCalledWith(
        expect.objectContaining({
          _type: "SendEmail",
          Source: "noreply@example.com",
          Destination: {
            ToAddresses: ["test-admin@example.com"],
          },
        })
      );
    });

    it("should send email to admin for user deck reports", async () => {
      mockDynamoSend.mockResolvedValueOnce(createDeckItem());
      mockSesSend.mockResolvedValueOnce({});

      const event: DynamoDBStreamEvent = {
        Records: [createReportRecord()],
      };

      await handler(event);

      expect(mockSesSend).toHaveBeenCalledWith(
        expect.objectContaining({
          _type: "SendEmail",
          Source: "noreply@example.com",
          Destination: {
            ToAddresses: ["test-admin@example.com"],
          },
        })
      );
    });

    it("should include deck type in subject for system deck", async () => {
      mockDynamoSend.mockResolvedValueOnce(createSystemDeckItem());
      mockSesSend.mockResolvedValueOnce({});

      const event: DynamoDBStreamEvent = {
        Records: [createReportRecord()],
      };

      await handler(event);

      expect(mockSesSend).toHaveBeenCalledWith(
        expect.objectContaining({
          Message: expect.objectContaining({
            Subject: expect.objectContaining({
              Data: expect.stringContaining("System Deck"),
            }),
          }),
        })
      );
    });

    it("should include deck type in subject for user deck", async () => {
      mockDynamoSend.mockResolvedValueOnce(createDeckItem());
      mockSesSend.mockResolvedValueOnce({});

      const event: DynamoDBStreamEvent = {
        Records: [createReportRecord()],
      };

      await handler(event);

      expect(mockSesSend).toHaveBeenCalledWith(
        expect.objectContaining({
          Message: expect.objectContaining({
            Subject: expect.objectContaining({
              Data: expect.stringContaining("User Deck"),
            }),
          }),
        })
      );
    });

    it("should include card question and answer in email", async () => {
      mockDynamoSend.mockResolvedValueOnce(createDeckItem());
      mockSesSend.mockResolvedValueOnce({});

      const event: DynamoDBStreamEvent = {
        Records: [createReportRecord()],
      };

      await handler(event);

      expect(mockSesSend).toHaveBeenCalledWith(
        expect.objectContaining({
          Message: expect.objectContaining({
            Body: expect.objectContaining({
              Text: expect.objectContaining({
                Data: expect.stringMatching(/What is 2\+2\?/),
              }),
            }),
          }),
        })
      );
    });

    it("should handle missing card gracefully", async () => {
      // Return a deck where the card ID doesn't match
      const deckWithoutMatchingCard = createDeckItem();
      deckWithoutMatchingCard.Item.cards = {
        L: [
          {
            M: {
              id: { S: "different-card" },
              question: { S: "Different question" },
              answer: { S: "Different answer" },
            },
          },
        ],
      };

      mockDynamoSend.mockResolvedValueOnce(deckWithoutMatchingCard);
      mockSesSend.mockResolvedValueOnce({});

      const event: DynamoDBStreamEvent = {
        Records: [createReportRecord()],
      };

      await handler(event);

      // Should still send email but mention card not found
      expect(mockSesSend).toHaveBeenCalledWith(
        expect.objectContaining({
          Message: expect.objectContaining({
            Body: expect.objectContaining({
              Text: expect.objectContaining({
                Data: expect.stringContaining("card not found"),
              }),
            }),
          }),
        })
      );
    });

    it("should log email not configured when FROM_EMAIL is missing", async () => {
      // This test requires module re-import since FROM_EMAIL is read at module load time
      // Reset modules to allow re-import with different env vars
      vi.resetModules();

      const originalFromEmail = process.env.FROM_EMAIL;
      process.env.FROM_EMAIL = "";

      // Re-import the module with new env vars
      const { handler: freshHandler } = await import("../notifyReportedCard");

      // Re-setup mocks after module reset
      const dynamoMod = await import("@aws-sdk/client-dynamodb") as typeof dynamoModule & {
        __mockDynamoSend: ReturnType<typeof vi.fn>;
      };
      const sesMod = await import("@aws-sdk/client-ses") as typeof sesModule & {
        __mockSesSend: ReturnType<typeof vi.fn>;
      };

      dynamoMod.__mockDynamoSend.mockResolvedValueOnce(createDeckItem());

      const event: DynamoDBStreamEvent = {
        Records: [createReportRecord()],
      };

      await freshHandler(event);

      expect(sesMod.__mockSesSend).not.toHaveBeenCalled();
      expect(console.warn).toHaveBeenCalledWith(
        "FROM_EMAIL or ADMIN_EMAIL not configured, logging report instead"
      );

      // Restore
      process.env.FROM_EMAIL = originalFromEmail;
      vi.resetModules();
    });
  });

  describe("HTML escaping", () => {
    it("should escape HTML special characters in report content", async () => {
      const recordWithXss = createReportRecord();
      (recordWithXss.dynamodb!.NewImage as Record<string, { S?: string }>).reason = {
        S: '<script>alert("xss")</script>',
      };

      mockDynamoSend.mockResolvedValueOnce(createDeckItem());
      mockSesSend.mockResolvedValueOnce({});

      const event: DynamoDBStreamEvent = {
        Records: [recordWithXss],
      };

      await handler(event);

      // The HTML body should have escaped characters
      expect(mockSesSend).toHaveBeenCalledWith(
        expect.objectContaining({
          Message: expect.objectContaining({
            Body: expect.objectContaining({
              Html: expect.objectContaining({
                Data: expect.not.stringContaining("<script>"),
              }),
            }),
          }),
        })
      );
    });
  });

  describe("Error handling", () => {
    it("should continue processing other records if one fails", async () => {
      // First record fails, second succeeds
      mockDynamoSend
        .mockRejectedValueOnce(new Error("DynamoDB error"))
        .mockResolvedValueOnce(createDeckItem());
      mockSesSend.mockResolvedValueOnce({});

      const event: DynamoDBStreamEvent = {
        Records: [createReportRecord(), createReportRecord()],
      };

      await handler(event);

      // Should have attempted DynamoDB twice
      expect(mockDynamoSend).toHaveBeenCalledTimes(2);
      // Should have sent email for the successful one
      expect(mockSesSend).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(
        "Error processing report:",
        expect.any(Error)
      );
    });

    it("should handle SES send error", async () => {
      mockDynamoSend.mockResolvedValueOnce(createDeckItem());
      mockSesSend.mockRejectedValueOnce(new Error("SES error"));

      const event: DynamoDBStreamEvent = {
        Records: [createReportRecord()],
      };

      await handler(event);

      expect(console.error).toHaveBeenCalledWith(
        "Error processing report:",
        expect.any(Error)
      );
    });
  });

  describe("Multiple records", () => {
    it("should process multiple records in a single event", async () => {
      mockDynamoSend
        .mockResolvedValueOnce(createDeckItem())
        .mockResolvedValueOnce(createSystemDeckItem());
      mockSesSend.mockResolvedValue({});

      const event: DynamoDBStreamEvent = {
        Records: [createReportRecord(), createReportRecord()],
      };

      await handler(event);

      expect(mockDynamoSend).toHaveBeenCalledTimes(2);
      expect(mockSesSend).toHaveBeenCalledTimes(2);
      expect(console.log).toHaveBeenCalledWith("Processing 2 records");
    });
  });
});
