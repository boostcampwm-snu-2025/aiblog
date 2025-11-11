interface LoaderProps {
  text?: string;
}

export default function Loader({ text = "Loading..." }: LoaderProps) {
  return (
    <div className="text-center py-4 text-gray-500 animate-pulse">
      {text}
    </div>
  );
}