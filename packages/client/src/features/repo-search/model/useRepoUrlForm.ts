import { useState, type FormEventHandler } from "react";

export function useRepoUrlForm() {
  const [repoUrl, setRepoUrl] = useState("");
  const [submittedRepoUrl, setSubmittedRepoUrl] = useState<string>();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const normalizedUrl = repoUrl.trim();
    if (!normalizedUrl) return;

    if (normalizedUrl === submittedRepoUrl) {
      setSubmittedRepoUrl(normalizedUrl);
      return;
    }

    setSubmittedRepoUrl(normalizedUrl);
  };

  return {
    repoUrl,
    setRepoUrl,
    submittedRepoUrl,
    onSubmitUrl: handleSubmit,
  };
}
