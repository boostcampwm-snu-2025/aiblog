import { getBearerToken } from "../utils/auth.js";
import { validateGeneratePostBody } from "../models/postModels.js";
import { generatePostService } from "../services/postService.js";

export async function generatePost(req, res, next) {
	try {
		const token = getBearerToken(req);

		const body = validateGeneratePostBody({
			repo: req.body?.repo,
			commits: req.body?.commits, // optional
			prs: req.body?.prs, // optional
			lang: req.body?.lang,
			tone: req.body?.tone,
		});

		const result = await generatePostService({
			token,
			repo: body.repo,
			commits: body.commits,
			prs: body.prs,
			lang: body.lang,
			tone: body.tone,
		});

		res.json(result);
	} catch (err) {
		next(err);
	}
}
