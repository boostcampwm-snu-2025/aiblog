import { Octokit } from '@octokit/rest';

export interface CommitDetails {
  sha: string;
  message: string;
  author: string;
  date: string;
  diff: string;
  filesChanged: string[];
  stats: {
    additions: number;
    deletions: number;
    total: number;
  };
}

/**
 * Octokit 인스턴스를 생성합니다.
 */
export function createOctokit(token?: string): Octokit {
  const auth = token || process.env.GITHUB_PAT || undefined;
  return new Octokit(auth ? { auth } : {});
}

/**
 * 특정 커밋의 상세 정보를 가져옵니다 (diff 포함).
 */
export async function getCommitDetails(
  owner: string,
  repo: string,
  sha: string,
  token?: string
): Promise<CommitDetails> {
  const octokit = createOctokit(token);

  try {
    // 커밋 정보 가져오기
    const { data: commit } = await octokit.repos.getCommit({
      owner,
      repo,
      ref: sha,
    });

    // diff 텍스트 생성
    let diff = '';
    const filesChanged: string[] = [];

    if (commit.files && commit.files.length > 0) {
      for (const file of commit.files) {
        filesChanged.push(file.filename);
        diff += `\n--- ${file.filename} ---\n`;
        diff += `Status: ${file.status}\n`;
        diff += `Changes: +${file.additions} -${file.deletions}\n`;
        if (file.patch) {
          diff += file.patch + '\n';
        }
      }
    }

    return {
      sha: commit.sha,
      message: commit.commit.message,
      author: commit.author?.login || commit.commit.author?.name || 'unknown',
      date: commit.commit.author?.date || '',
      diff: diff.trim(),
      filesChanged,
      stats: {
        additions: commit.stats?.additions || 0,
        deletions: commit.stats?.deletions || 0,
        total: commit.stats?.total || 0,
      },
    };
  } catch (error: any) {
    console.error('커밋 정보 가져오기 실패:', error);
    throw new Error(`커밋 정보를 가져올 수 없습니다: ${error.message}`);
  }
}

/**
 * 저장소의 기본 정보를 가져옵니다.
 */
export async function getRepositoryInfo(
  owner: string,
  repo: string,
  token?: string
): Promise<{ name: string; description: string | null; language: string | null }> {
  const octokit = createOctokit(token);

  try {
    const { data } = await octokit.repos.get({ owner, repo });

    return {
      name: data.name,
      description: data.description,
      language: data.language,
    };
  } catch (error: any) {
    console.error('저장소 정보 가져오기 실패:', error);
    throw new Error(`저장소 정보를 가져올 수 없습니다: ${error.message}`);
  }
}
