import { useState } from "react";

import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";

type RepositorySearchBarProps = {
  initValues: {
    owner: string;
    repository: string;
  };
  onSearch: (owner: string, repository: string) => void;
};

export default function RepositorySearchBar({ initValues, onSearch }: RepositorySearchBarProps) {
  const [owner, setOwner] = useState(initValues.owner);
  const [repository, setRepository] = useState(initValues.repository);

  const handleSearchButtonClick = () => {
    onSearch(owner, repository);
  };

  return (
    <form
      className="flex items-end justify-center gap-4"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <fieldset className="flex gap-4">
        <TextInput label="Owner" value={owner} onChange={(e) => setOwner(e.target.value)} />
        <TextInput label="Repository" value={repository} onChange={(e) => setRepository(e.target.value)} />
      </fieldset>
      <Button onClick={handleSearchButtonClick}>검색</Button>
    </form>
  );
}
