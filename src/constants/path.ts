export const PATHS = {
  home: { path: "/", getHref: () => "/" },
  posts: {
    path: "/posts",
    create: {
      path: "create",
      getHref: () => "/posts/create",

      search: {
        path: "create/search",
        getHref: () => "/posts/create/search",
      },
    },
  },
} as const;
