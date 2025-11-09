import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";

const inputVariants = cva(
  "w-full rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus-visible:border-gray-900 focus-visible:ring-gray-900",
        outline:
          "border-gray-300 bg-transparent text-gray-900 placeholder:text-gray-400 focus-visible:border-gray-900 focus-visible:ring-gray-900",
        filled:
          "border-transparent bg-gray-100 text-gray-900 placeholder:text-gray-400 focus-visible:bg-white focus-visible:border-gray-300 focus-visible:ring-gray-900",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-5 text-base",
      },
      state: {
        default: "",
        error:
          "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500",
        success:
          "border-green-500 focus-visible:border-green-500 focus-visible:ring-green-500",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      state: "default",
    },
  }
);

const labelVariants = cva("block font-medium mb-1.5", {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    },
    required: {
      true: "after:content-['*'] after:ml-0.5 after:text-red-500",
    },
  },
  defaultVariants: {
    size: "md",
    required: false,
  },
});

const helperTextVariants = cva("mt-1.5", {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-sm",
    },
    state: {
      default: "text-gray-500",
      error: "text-red-600",
      success: "text-green-600",
    },
  },
  defaultVariants: {
    size: "md",
    state: "default",
  },
});

export type TextInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
> &
  VariantProps<typeof inputVariants> & {
    label?: string;
    helperText?: string;
    errorText?: string;
    successText?: string;
    fullWidth?: boolean;
  };

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      className,
      variant,
      size,
      state: stateProp,
      label,
      helperText,
      errorText,
      successText,
      fullWidth = false,
      required,
      disabled,
      ...props
    },
    ref
  ) => {
    const state = errorText ? "error" : successText ? "success" : stateProp;
    const displayHelperText = errorText || successText || helperText;

    return (
      <div className={clsx("flex flex-col", fullWidth ? "w-full" : "")}>
        {label && (
          <label
            className={labelVariants({ size, required: required || false })}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={clsx(inputVariants({ variant, size, state }), className)}
          disabled={disabled}
          required={required}
          {...props}
        />
        {displayHelperText && (
          <p className={helperTextVariants({ size, state })}>
            {displayHelperText}
          </p>
        )}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";
