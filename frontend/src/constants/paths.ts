export const PATHS = {
  home: { path: "/", getHref: () => "/" },
  post: {
    path: "/post",
    create: {
      path: "create",
      getHref: () => "/post/create",
    },
    detail: {
      path: ":postId",
      getHref: (postId: string) => `/post/${postId}`,
    },
  },
  search: {
    path: "/search",
    getHref: () => "/search",
  },
  notFound: {
    path: "/not-found",
    getHref: () => "/not-found",
  },
} as const;
