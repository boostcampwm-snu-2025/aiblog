import type { PropsWithChildren } from "react";

type BadgeProps = {
  bgColor?: string;
} & PropsWithChildren;

export default function Badge({ bgColor, children }: BadgeProps) {
  return <div className={`w-fit rounded-full px-4 py-2 ${bgColor}`}>{children}</div>;
}
