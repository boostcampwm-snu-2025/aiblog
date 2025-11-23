import { useCallback } from 'react';
import { useMainPageContext } from '@/contexts/MainPageContext';

const getItemId = (item) => item.oid || item.id;

export function useCommitNotes() {
  const { activeCommit, commitNotes, updateCommitNote } = useMainPageContext();

  const handleNoteChange = useCallback(
    (event) => {
      if (!activeCommit) return;

      const newNote = event.target.value;
      const currentId = getItemId(activeCommit);

      updateCommitNote(currentId, newNote);
    },
    [activeCommit, updateCommitNote]
  );

  const currentNote = activeCommit ? (commitNotes[getItemId(activeCommit)] || '') : '';

  return {
    currentNote,
    handleNoteChange,
    activeCommit,
  };
}