"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Tabs,
  Tab,
  Textarea,
} from "@nextui-org/react";
import { useState } from "react";
import type { Card } from "shared";

interface AddDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, cards?: Card[]) => Promise<void>;
  onDeckCreated?: () => void;
}

const JSON_EXAMPLE = `{
  "title": "My Deck Title",
  "cards": [
    { "question": "Question 1", "answer": "Answer 1" },
    { "question": "Question 2", "answer": "Answer 2" }
  ]
}`;

export function AddDeckModal({
  isOpen,
  onClose,
  onSubmit,
  onDeckCreated,
}: AddDeckModalProps) {
  const [selectedTab, setSelectedTab] = useState<string>("text");
  const [title, setTitle] = useState("");
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    setTitle("");
    setJsonInput("");
    setError("");
    setSelectedTab("text");
    onClose();
  };

  const handleSubmit = async () => {
    setError("");
    setIsSubmitting(true);

    try {
      if (selectedTab === "text") {
        if (!title.trim()) {
          setError("Title is required");
          return;
        }
        await onSubmit(title.trim());
      } else {
        if (!jsonInput.trim()) {
          setError("JSON is required");
          return;
        }

        let parsed: { title: string; cards: Array<{ question: string; answer: string }> };
        try {
          // Sanitize input: fix newlines inside string literals
          // JSON doesn't allow literal newlines in strings - they must be escaped
          let sanitized = jsonInput.trim();

          // Replace literal newlines inside strings with escaped \n
          // This regex finds content between quotes and escapes newlines within
          sanitized = sanitized.replace(/"([^"\\]|\\.)*"/g, (match) => {
            return match
              .replace(/\r\n/g, "\\n")
              .replace(/\r/g, "\\n")
              .replace(/\n/g, "\\n")
              .replace(/\t/g, "\\t");
          });

          parsed = JSON.parse(sanitized);
        } catch (e) {
          const errorMsg = e instanceof Error ? e.message : "Unknown error";
          setError(`Invalid JSON format: ${errorMsg}`);
          return;
        }

        if (!parsed.title || typeof parsed.title !== "string") {
          setError("Missing or invalid 'title' field");
          return;
        }

        if (!Array.isArray(parsed.cards)) {
          setError("Missing or invalid 'cards' array");
          return;
        }

        for (let i = 0; i < parsed.cards.length; i++) {
          const card = parsed.cards[i];
          if (!card.question || !card.answer) {
            setError(`Card ${i + 1} is missing 'question' or 'answer'`);
            return;
          }
        }

        await onSubmit(parsed.title, parsed.cards as Card[]);
      }

      handleClose();
      onDeckCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create deck");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isTextDisabled = selectedTab === "text" && !title.trim();
  const isJsonDisabled = selectedTab === "json" && !jsonInput.trim();
  const isDisabled = isTextDisabled || isJsonDisabled || isSubmitting;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      backdrop="blur"
      placement="center"
      size="2xl"
      classNames={{
        wrapper: "md:pl-64",
        backdrop: "bg-black/50",
      }}
    >
      <ModalContent className="bg-white shadow-xl rounded-xl">
        <ModalHeader className="border-b border-neutral-200 p-4 flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Create New Deck</h2>
          <Tabs
            selectedKey={selectedTab}
            onSelectionChange={(key) => {
              setSelectedTab(key as string);
              setError("");
            }}
            classNames={{
              tabList: "bg-gray-100 p-1",
              tab: "text-gray-600",
              cursor: "bg-white shadow-sm",
            }}
          >
            <Tab key="text" title="Text Input" />
            <Tab key="json" title="JSON Import" />
          </Tabs>
        </ModalHeader>
        <ModalBody className="p-6">
          {selectedTab === "text" ? (
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-neutral-700"
                htmlFor="deckTitle"
              >
                Deck Title
              </label>
              <input
                className="w-full p-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                id="deckTitle"
                placeholder="Enter deck title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                You can add cards after creating the deck.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 font-medium mb-2">
                  Paste your deck JSON below
                </p>
                <p className="text-xs text-blue-600">
                  Tip: Ask ChatGPT or Claude to generate flashcards in this format!
                </p>
              </div>

              {/* Example format - collapsible */}
              <details className="bg-gray-50 border border-gray-200 rounded-lg">
                <summary className="px-4 py-2 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100">
                  View example format
                </summary>
                <pre className="px-4 pb-3 text-xs text-gray-600 overflow-x-auto">
{JSON_EXAMPLE}
                </pre>
              </details>

              {/* JSON Input - clear empty state */}
              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-neutral-700"
                  htmlFor="jsonInput"
                >
                  Your JSON
                </label>
                <Textarea
                  id="jsonInput"
                  placeholder="Paste your JSON here..."
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  minRows={10}
                  maxRows={20}
                  classNames={{
                    input: "font-mono text-sm",
                    inputWrapper: "border-2 border-dashed border-gray-300 hover:border-gray-400 focus-within:border-blue-500 focus-within:border-solid",
                  }}
                />
              </div>
            </div>
          )}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </ModalBody>
        <ModalFooter className="border-t border-neutral-200 p-4">
          <div className="flex justify-end gap-3">
            <Button variant="bordered" onPress={handleClose} isDisabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              isDisabled={isDisabled}
              isLoading={isSubmitting}
              onPress={handleSubmit}
            >
              {selectedTab === "json" ? "Import Deck" : "Create Deck"}
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
