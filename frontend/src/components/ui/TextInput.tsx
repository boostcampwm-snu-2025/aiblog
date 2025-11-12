type TextInputProps = {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function TextInput({ label, value, onChange }: TextInputProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={label} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        value={value}
        onChange={onChange}
        id={label}
        type="text"
        className="h-10 rounded-md border border-gray-300 px-4 py-2"
      />
    </div>
  );
}
