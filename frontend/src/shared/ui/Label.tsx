type LabelProps = {
  label: string;
  required?: boolean;
};

export default function Label({ label, required = false }: LabelProps) {
  return (
    <label htmlFor={label} className="text-sm font-medium text-gray-700">
      {label}
      {required && <span className="ml-1 text-red-600">*</span>}
    </label>
  );
}
