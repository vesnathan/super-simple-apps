"use client";

/**
 * Styled form input components with consistent light theme styling
 * Adapted from The Story Hub
 */

import { forwardRef } from "react";
import { Input, type InputProps } from "@nextui-org/react";

// Shared styling constants for light theme
const INPUT_WRAPPER_CLASSES =
  "!bg-gray-50 border border-gray-200 hover:!bg-gray-100 focus-within:!bg-white data-[hover=true]:!bg-gray-100 data-[focus=true]:!bg-white";
const INPUT_TEXT_CLASSES =
  "text-gray-900 !text-gray-900 placeholder:text-gray-400";
const LABEL_CLASSES = "text-gray-700";
const DESCRIPTION_CLASSES = "text-gray-500";

/**
 * Styled Input component with light theme
 * Drop-in replacement for NextUI Input
 */
export const StyledInput = forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    const { classNames, ...rest } = props;

    return (
      <Input
        ref={ref}
        {...rest}
        classNames={{
          input: `${INPUT_TEXT_CLASSES} ${classNames?.input || ""}`,
          inputWrapper: `${INPUT_WRAPPER_CLASSES} ${classNames?.inputWrapper || ""}`,
          label: `${LABEL_CLASSES} ${classNames?.label || ""}`,
          description: `${DESCRIPTION_CLASSES} ${classNames?.description || ""}`,
          base: classNames?.base || "",
        }}
      />
    );
  },
);
StyledInput.displayName = "StyledInput";
