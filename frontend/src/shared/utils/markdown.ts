/**
 * 마크다운 문법을 제거하고 plain text로 변환합니다.
 */
export const stripMarkdown = (markdown: string): string => {
  return (
    markdown
      // 코드 블록 제거 ```code```
      .replace(/```[\s\S]*?```/g, "")
      // 인라인 코드 제거 `code` -> code
      .replace(/`([^`]+)`/g, "$1")
      // 헤딩 제거 (# ## ### 등)
      .replace(/^#{1,6}\s+/gm, "")
      // 볼드 제거 (**text**, __text__)
      .replace(/(\*\*|__)(.*?)\1/g, "$2")
      // 이탤릭 제거 (*text*, _text_)
      .replace(/(\*|_)(.*?)\1/g, "$2")
      // 취소선 제거 (~~text~~)
      .replace(/~~(.*?)~~/g, "$1")
      // 이미지 제거 ![alt](url)
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, "")
      // 링크 제거 [text](url) -> text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      // 리스트 마커 제거 (-, *, +, 1.)
      .replace(/^\s*[-*+]\s+/gm, "")
      .replace(/^\s*\d+\.\s+/gm, "")
      // 인용구 제거 (>)
      .replace(/^\s*>\s+/gm, "")
      // 수평선 제거 (---, ***, ___)
      .replace(/^[\s-*_]{3,}\s*$/gm, "")
      // 테이블 구분자 제거 (|)
      .replace(/\|/g, " ")
      // 연속된 공백을 하나로
      .replace(/\s+/g, " ")
      // 연속된 빈 줄을 하나로
      .replace(/\n{2,}/g, "\n")
      .trim()
  );
};
