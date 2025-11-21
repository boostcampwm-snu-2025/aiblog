import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../libs/utils";

// <textarea> 태그에 대한 cva 정의
const textareaVariants = cva(
    "w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
);

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
        VariantProps<typeof textareaVariants> {
    label?: string;
    id: string;
}

const Textarea: React.FC<TextareaProps> = ({
    label,
    id,
    className,
    ...props
}) => {
    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={id}
                    className="block text-xl font-medium text-gray-900 mb-1 text-left"
                >
                    {label}
                </label>
            )}
            <textarea
                id={id}
                className={cn(textareaVariants({ className }))}
                {...props}
            />
        </div>
    );
};

export default Textarea;
