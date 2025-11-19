type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className="flex h-10 cursor-pointer items-center justify-center rounded-md bg-blue-600 px-5 text-white hover:opacity-80 active:opacity-64 disabled:opacity-32"
    >
      {props.children}
    </button>
  );
}
