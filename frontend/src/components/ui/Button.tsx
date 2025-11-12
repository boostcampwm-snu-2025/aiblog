type ButtonProps = { text: string } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type">;

export default function Button({ text, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className="flex h-10 cursor-pointer items-center justify-center rounded-md bg-blue-600 px-5 text-white"
      type="button"
    >
      {text}
    </button>
  );
}
