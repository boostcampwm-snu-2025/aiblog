import { type FormEvent, useReducer } from "react";

export type SearchType = "org" | "repositories" | "user";

type SearchAction =
  | { payload: SearchType; type: "SET_TYPE" }
  | { payload: string; type: "SET_QUERY" }
  | { type: "SUBMIT_SEARCH" };

interface SearchState {
  searchQuery: string;
  searchType: SearchType;
  submittedQuery: string;
  submittedType: null | SearchType;
}

const initialState: SearchState = {
  searchQuery: "",
  searchType: "repositories",
  submittedQuery: "",
  submittedType: null,
};

export function useSearchState() {
  const [state, dispatch] = useReducer(searchReducer, initialState);

  const handleQueryChange = (query: string) => {
    dispatch({ payload: query, type: "SET_QUERY" });
  };

  const handleTypeChange = (type: SearchType) => {
    dispatch({ payload: type, type: "SET_TYPE" });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    dispatch({ type: "SUBMIT_SEARCH" });
  };

  return {
    handleQueryChange,
    handleSubmit,
    handleTypeChange,
    searchQuery: state.searchQuery,
    searchType: state.searchType,
    submittedQuery: state.submittedQuery,
    submittedType: state.submittedType,
  };
}

function searchReducer(state: SearchState, action: SearchAction): SearchState {
  switch (action.type) {
    case "SET_QUERY":
      return { ...state, searchQuery: action.payload };
    case "SET_TYPE":
      return { ...state, searchType: action.payload };
    case "SUBMIT_SEARCH": {
      const trimmedQuery = state.searchQuery.trim();
      if (!trimmedQuery) {
        return state;
      }
      return {
        ...state,
        submittedQuery: trimmedQuery,
        submittedType: state.searchType,
      };
    }
    default:
      return state;
  }
}
