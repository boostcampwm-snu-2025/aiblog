import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";

const panelVariants = cva("transition-colors", {
  variants: {
    variant: {
      default: "bg-white border-l border-gray-200",
      elevated: "bg-white shadow-lg",
      ghost: "bg-gray-50",
      transparent: "bg-transparent",
    },
    size: {
      sm: "w-64",
      md: "w-80",
      lg: "w-96",
      xl: "w-[28rem]",
      full: "w-full",
    },
    padding: {
      none: "p-0",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
    padding: "md",
  },
});

export type PanelProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof panelVariants> & {
    position?: "left" | "right";
  };

export const Panel = forwardRef<HTMLDivElement, PanelProps>(
  (
    {
      className,
      variant,
      size,
      padding,
      position = "right",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <aside
        ref={ref}
        className={clsx(
          panelVariants({ variant, size, padding }),
          position === "left" && "order-first",
          position === "right" && "order-last",
          className
        )}
        {...props}
      >
        {children}
      </aside>
    );
  }
);

Panel.displayName = "Panel";

export const PanelHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={clsx("border-b border-gray-200 pb-4 mb-4", className)}
      {...props}
    >
      {children}
    </div>
  );
});

PanelHeader.displayName = "PanelHeader";

export const PanelTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => {
  return (
    <h2
      ref={ref}
      className={clsx("text-xl font-semibold text-gray-900", className)}
      {...props}
    >
      {children}
    </h2>
  );
});

PanelTitle.displayName = "PanelTitle";

export const PanelContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={clsx("", className)} {...props}>
      {children}
    </div>
  );
});

PanelContent.displayName = "PanelContent";

export const PanelFooter = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={clsx("border-t border-gray-200 pt-4 mt-4", className)}
      {...props}
    >
      {children}
    </div>
  );
});

PanelFooter.displayName = "PanelFooter";
