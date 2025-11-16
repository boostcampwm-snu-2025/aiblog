export const parseRepoInput = (input) => {
  try {
    if (input.startsWith('http')) {
      const url = new URL(input);
      const pathParts = url.pathname.split('/').filter(Boolean); // ["owner", "repo"]
      if (pathParts.length >= 2) {
        return `${pathParts[0]}/${pathParts[1]}`;
      }
    }
    if (input.includes('/') && input.split('/').length === 2) {
      return input;
    }
  } catch (e) {
    console.error('Invalid URL or format:', e);
  }
  return null; // 유효하지 않은 형식
};