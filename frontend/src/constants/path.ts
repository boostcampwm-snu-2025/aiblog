export const PATHS = {
  home: { path: "/", getHref: () => "/" },
  post: {
    path: "/post",
    create: {
      path: "create",
      getHref: () => "/post/create",
    },
  },
  search: {
    path: "/search",
    getHref: () => "/search",
  },
} as const;
