
export type ValidationResult =
  | { ok: true }
  | { ok: false; reason: string };

export function validateRepoUrl(url: string): ValidationResult {
  if (!url.trim()) {
    return { ok: false, reason: 'Repository URL is required' };
  }

  const githubPattern = /^https:\/\/github\.com\/[\w-]+\/[\w-]+\/?$/;
  
  if (!githubPattern.test(url.trim())) {
    return {
      ok: false,
      reason: 'Invalid GitHub repository URL format. Expected: https://github.com/owner/repo',
    };
  }

  return { ok: true };
}

export function validatePRNumber(prNumber: number): ValidationResult {
  if (!Number.isInteger(prNumber)) {
    return { ok: false, reason: 'PR number must be an integer' };
  }

  if (prNumber <= 0) {
    return { ok: false, reason: 'PR number must be greater than 0' };
  }

  return { ok: true };
}

export function validateBlogPostContent(content: string): ValidationResult {
  if (!content.trim()) {
    return { ok: false, reason: 'Blog post content cannot be empty' };
  }

  const minLength = 10;
  if (content.trim().length < minLength) {
    return {
      ok: false,
      reason: `Blog post content must be at least ${minLength} characters`,
    };
  }

  return { ok: true };
}

export function validateBlogPostTitle(title: string): ValidationResult {
  if (!title.trim()) {
    return { ok: false, reason: 'Blog post title cannot be empty' };
  }

  const maxLength = 200;
  if (title.length > maxLength) {
    return {
      ok: false,
      reason: `Blog post title cannot exceed ${maxLength} characters`,
    };
  }

  return { ok: true };
}

