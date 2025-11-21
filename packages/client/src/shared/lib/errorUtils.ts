export function extractErrorMessage(
  error: unknown,
  defaultMessage: string
): string {
  if (error instanceof Error) {
    return error.message;
  }
  return defaultMessage;
}
