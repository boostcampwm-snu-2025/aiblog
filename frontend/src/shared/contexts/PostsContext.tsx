import { createContext, useContext, useEffect, useReducer } from "react";

export interface Post {
  title: string;
  content: string;
  createdAt: string;
}

type PostsState = Post[];

type Action =
  | { type: "ADD_POST"; payload: Post }
  | { type: "DELETE_POST"; payload: string }
  | { type: "EDIT_POST"; payload: Post };

function postsReducer(state: PostsState, action: Action): PostsState {
  switch (action.type) {
    case "ADD_POST":
      return [...state, action.payload];

    case "DELETE_POST":
      return state.filter(post => post.createdAt !== action.payload);

    case "EDIT_POST":
      return state.map(post =>
        post.createdAt === action.payload.createdAt ? action.payload : post
      );

    default:
      return state;
  }
}

const PostsContext = createContext<{
  posts: PostsState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function PostsProvider({ children }: { children: React.ReactNode }) {
  const [posts, dispatch] = useReducer(postsReducer, [], () => {
    return JSON.parse(localStorage.getItem("blog-posts") || "[]");
  });

  // localStorage 동기화
  useEffect(() => {
    localStorage.setItem("blog-posts", JSON.stringify(posts));
  }, [posts]);

  return (
    <PostsContext.Provider value={{ posts, dispatch }}>
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  const ctx = useContext(PostsContext);
  if (!ctx) throw new Error("usePosts must be used inside PostsProvider");
  return ctx;
}