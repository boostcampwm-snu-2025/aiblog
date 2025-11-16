type DividerProps = {
  orientation?: "horizontal" | "vertical";
  color?: string;
};

export default function Divider({ orientation = "horizontal", color = "border-gray-300" }: DividerProps) {
  const orientationClass = orientation === "horizontal" ? "border-b w-full" : "border-r h-full";
  const styleClass = `${color} ${orientationClass}`;

  return <div className={styleClass} />;
}
