import type { FormEventHandler } from "react";
import { TextInput } from "@shared";

export interface RepoSearchFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  error?: string;
}

export function RepoSearchForm({
  value,
  onChange,
  onSubmit,
  error,
}: RepoSearchFormProps) {
  return (
    <form className="flex w-full gap-3 items-center" onSubmit={onSubmit}>
      <TextInput
        label="Repository URL"
        placeholder="https://github.com/owner/repository"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        fullWidth
        required
        errorText={error}
      />
    </form>
  );
}
