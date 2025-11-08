type ButtonProps = { text: string } & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ text, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      type="button"
      className="flex h-10 cursor-pointer items-center justify-center rounded-md bg-blue-600 px-5 text-white"
    >
      {text}
    </button>
  );
}
