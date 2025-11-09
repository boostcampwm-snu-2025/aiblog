import { useCallback } from 'react';
import { useAppContext } from '@/contexts/AppContext';

// Helper to get the unique ID for an item
const getItemId = (item) => item.oid || item.id;

/**
 * Custom hook to manage commit notes logic.
 */
export function useCommitNotes() {
  const { activeCommit, commitNotes, setCommitNotes } = useAppContext();

  /**
   * Handles changes to the notes textarea.
   * Updates the commitNotes state immutably.
   */
  const handleNoteChange = useCallback(
    (event) => {
      if (!activeCommit) return;

      const newNote = event.target.value;
      const currentId = getItemId(activeCommit);

      setCommitNotes((prevNotes) => ({
        ...prevNotes,
        [currentId]: newNote,
      }));
    },
    [activeCommit, setCommitNotes]
  );

  // Get the note for the currently active commit
  const currentNote = activeCommit ? (commitNotes[getItemId(activeCommit)] || '') : '';

  return {
    currentNote,
    handleNoteChange,
    activeCommit, // Expose activeCommit if needed by the consumer
  };
}