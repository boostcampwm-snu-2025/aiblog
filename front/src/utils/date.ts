export const formatDate = (
  iso: string,
  locales?: Intl.LocalesArgument,
  options?: Intl.DateTimeFormatOptions
) => {
  const d = new Date(iso);
  return d.toLocaleDateString(locales, {
    year: "numeric",
    month: "long",
    day: "2-digit",
    ...(options || {}),
  });
};

