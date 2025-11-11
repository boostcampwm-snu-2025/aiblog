type TextInputProps = {
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function TextInput({ label, ...props }: TextInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={props.id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input {...props} type="text" className="h-10 rounded-md border border-gray-300 px-4 py-2" />
    </div>
  );
}
