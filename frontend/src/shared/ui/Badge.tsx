import type { PropsWithChildren } from "react";

type BadgeProps = PropsWithChildren<{
  bgColor?: string;
}>;

export default function Badge({ bgColor, children }: BadgeProps) {
  return <div className={`w-fit rounded-full px-4 py-2 ${bgColor}`}>{children}</div>;
}
