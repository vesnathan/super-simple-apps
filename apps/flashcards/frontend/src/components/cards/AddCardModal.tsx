import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
  RadioGroup,
  Radio,
  Input,
  Accordion,
  AccordionItem,
} from "@nextui-org/react";
import { Button } from "@super-simple-apps/shared-assets";
import type { Card, CardType } from "@simple-flashcards/shared";

interface CardFormData {
  question: string;
  answer: string;
  cardType: CardType;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  researchUrl?: string;
  imageUrl?: string;
}

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (cardData: CardFormData) => void;
  editCard: Card | null;
}

export function AddCardModal({
  isOpen,
  onClose,
  onSubmit,
  editCard,
}: AddCardModalProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [cardType, setCardType] = useState<CardType>("text");
  const [options, setOptions] = useState<string[]>(["", "", ""]);
  const [correctOptionIndex, setCorrectOptionIndex] = useState<number>(0);
  const [explanation, setExplanation] = useState("");
  const [researchUrl, setResearchUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (editCard) {
      setQuestion(editCard.question);
      setAnswer(editCard.answer);
      setCardType((editCard.cardType as CardType) || "text");
      setOptions(editCard.options || ["", "", ""]);
      setCorrectOptionIndex(editCard.correctOptionIndex ?? 0);
      setExplanation(editCard.explanation || "");
      setResearchUrl(editCard.researchUrl || "");
      setImageUrl(editCard.imageUrl || "");
    } else {
      resetForm();
    }
  }, [editCard, isOpen]);

  const resetForm = () => {
    setQuestion("");
    setAnswer("");
    setCardType("text");
    setOptions(["", "", ""]);
    setCorrectOptionIndex(0);
    setExplanation("");
    setResearchUrl("");
    setImageUrl("");
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const isValid = () => {
    if (!question.trim()) return false;

    if (cardType === "text") {
      return answer.trim().length > 0;
    } else {
      // Multiple choice: all options must be filled
      return options.every((opt) => opt.trim().length > 0);
    }
  };

  const handleSubmit = () => {
    if (!isValid()) return;

    const cardData: CardFormData = {
      question: question.trim(),
      answer: cardType === "text" ? answer.trim() : options[correctOptionIndex].trim(),
      cardType,
      options: cardType === "multiple-choice" ? options.map((o) => o.trim()) : [],
      correctOptionIndex: cardType === "multiple-choice" ? correctOptionIndex : 0,
      explanation: explanation.trim(),
      researchUrl: researchUrl.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
    };

    onSubmit(cardData);
    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      backdrop="blur"
      placement="center"
      size="lg"
      scrollBehavior="inside"
      classNames={{
        wrapper: "z-[100] md:pl-64",
        backdrop: "z-[99] bg-black/50 backdrop-blur-sm",
        base: "z-[100]",
      }}
    >
      <ModalContent className="bg-white shadow-xl rounded-xl max-h-[90vh]">
        <ModalHeader className="border-b border-neutral-200 p-4">
          <h2 className="text-xl font-semibold">
            {editCard ? "Edit Card" : "Add New Card"}
          </h2>
        </ModalHeader>
        <ModalBody className="p-6 space-y-5 overflow-y-auto">
          {/* Question */}
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-neutral-700"
              htmlFor="question"
            >
              Question
            </label>
            <Textarea
              id="question"
              placeholder="Enter your question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              minRows={2}
              classNames={{
                inputWrapper: "border border-neutral-300",
              }}
            />
          </div>

          {/* Card Type Toggle */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">
              Answer Type
            </label>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={cardType === "text" ? "primary" : "outline"}
                onClick={() => setCardType("text")}
              >
                Simple Text
              </Button>
              <Button
                size="sm"
                variant={cardType === "multiple-choice" ? "primary" : "outline"}
                onClick={() => setCardType("multiple-choice")}
              >
                Multiple Choice
              </Button>
            </div>
          </div>

          {/* Text Answer (shown for text type) */}
          {cardType === "text" && (
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-neutral-700"
                htmlFor="answer"
              >
                Answer
              </label>
              <Textarea
                id="answer"
                placeholder="Enter your answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                minRows={2}
                classNames={{
                  inputWrapper: "border border-neutral-300",
                }}
              />
            </div>
          )}

          {/* Multiple Choice Options (shown for multiple-choice type) */}
          {cardType === "multiple-choice" && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-neutral-700">
                Options (select the correct answer)
              </label>
              <RadioGroup
                value={correctOptionIndex.toString()}
                onValueChange={(val) => setCorrectOptionIndex(parseInt(val))}
              >
                {options.map((option, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Radio
                      value={index.toString()}
                      classNames={{
                        wrapper: "group-data-[selected=true]:border-green-500",
                        control: "group-data-[selected=true]:bg-green-500",
                      }}
                    />
                    <input
                      className="flex-1 p-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                    />
                    {correctOptionIndex === index && (
                      <span className="text-green-600 text-sm font-medium">
                        Correct
                      </span>
                    )}
                  </div>
                ))}
              </RadioGroup>
              <p className="text-xs text-neutral-500">
                Click the radio button next to the correct answer
              </p>
            </div>
          )}

          {/* Optional Fields Accordion */}
          <Accordion
            variant="bordered"
            className="px-0"
            itemClasses={{
              base: "py-0",
              title: "text-sm font-medium text-neutral-600",
              trigger: "py-3 px-4",
              content: "px-4 pb-4 pt-0",
            }}
          >
            <AccordionItem
              key="extras"
              aria-label="Extra options"
              title={
                <span className="flex items-center gap-2">
                  Extra Options
                  <span className="text-xs text-neutral-400 font-normal">
                    (explanation, image, link)
                  </span>
                </span>
              }
            >
              <div className="space-y-4">
                {/* Explanation */}
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-neutral-700"
                    htmlFor="explanation"
                  >
                    Explanation
                  </label>
                  <Textarea
                    id="explanation"
                    placeholder="Why is this the correct answer?"
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    minRows={2}
                    classNames={{
                      inputWrapper: "border border-neutral-300",
                    }}
                  />
                </div>

                {/* Image URL */}
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-neutral-700"
                    htmlFor="imageUrl"
                  >
                    Image URL
                  </label>
                  <Input
                    id="imageUrl"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    classNames={{
                      inputWrapper: "border border-neutral-300",
                    }}
                  />
                  {imageUrl && (
                    <div className="mt-2 p-2 border border-neutral-200 rounded-lg">
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="max-h-32 mx-auto object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Research URL */}
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-neutral-700"
                    htmlFor="researchUrl"
                  >
                    Research Link
                  </label>
                  <Input
                    id="researchUrl"
                    type="url"
                    placeholder="https://example.com/learn-more"
                    value={researchUrl}
                    onChange={(e) => setResearchUrl(e.target.value)}
                    classNames={{
                      inputWrapper: "border border-neutral-300",
                    }}
                  />
                </div>
              </div>
            </AccordionItem>
          </Accordion>
        </ModalBody>
        <ModalFooter className="border-t border-neutral-200 p-4">
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={!isValid()}
              onClick={handleSubmit}
            >
              {editCard ? "Save Changes" : "Add Card"}
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
