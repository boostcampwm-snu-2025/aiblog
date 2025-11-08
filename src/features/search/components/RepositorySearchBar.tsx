import { useState } from "react";

import { useSearchParams } from "react-router";

import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";

export default function RepositorySearchBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [owner, setOwner] = useState(searchParams.get("owner") ?? "");
  const [repository, setRepository] = useState(searchParams.get("repository") ?? "");

  const handleButtonClick = () => {
    setSearchParams({
      owner,
      repository,
    });
  };

  return (
    <section className="flex items-end justify-center gap-4">
      <fieldset className="flex gap-4">
        <TextInput label="Owner" value={owner} onChange={(e) => setOwner(e.target.value)} />
        <TextInput label="Repository" value={repository} onChange={(e) => setRepository(e.target.value)} />
      </fieldset>
      <Button text="검색" onClick={handleButtonClick} />
    </section>
  );
}
