import fs from "node:fs/promises";

const DATA_PATH = "data";

function getDirPath(owner: string, repo: string): string {
	return `${DATA_PATH}/${owner}/${repo}`;
}

function getFilePath(owner: string, repo: string, ref: string): string {
	return `${getDirPath(owner, repo)}/${ref}.txt`;
}

export async function exists(
	owner: string,
	repo: string,
	ref: string,
): Promise<boolean> {
	return fs
		.access(getFilePath(owner, repo, ref), fs.constants.F_OK)
		.then(() => true)
		.catch(() => false);
}

export async function read(
	owner: string,
	repo: string,
	ref: string,
): Promise<string> {
	return fs.readFile(getFilePath(owner, repo, ref), { encoding: "utf-8" });
}

export async function save(
	owner: string,
	repo: string,
	ref: string,
	content: string,
): Promise<void> {
	await fs.mkdir(getDirPath(owner, repo), { recursive: true });
	await fs.writeFile(getFilePath(owner, repo, ref), content, {
		encoding: "utf-8",
	});
}

export async function remove(
	owner: string,
	repo: string,
	ref: string,
): Promise<boolean> {
	return fs
		.rm(getFilePath(owner, repo, ref))
		.then(() => true)
		.catch(() => false);
}

export async function listAll(): Promise<
	Array<{
		owner: string;
		repo: string;
		ref: string;
		generatedAt: string;
	}>
> {
	const dirs = await fs.readdir(DATA_PATH, {
		recursive: true,
		withFileTypes: true,
	});

	const summaries = await Promise.all(
		dirs.map(async (dir) => {
			const [owner, repo] = dir.parentPath.split("/").slice(-2);
			const filename = dir.name;

			if (owner === undefined || repo === undefined || !dir.isFile()) {
				return null;
			}

			const ref = filename.replace(/\.txt$/, "");
			const stat = await fs.stat(getFilePath(owner, repo, ref));
			const generatedAt = stat.mtime.toISOString();

			return { owner, repo, ref, generatedAt };
		}),
	);

	return summaries.filter((item) => item !== null);
}
