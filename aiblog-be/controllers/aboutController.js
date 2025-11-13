import { getGeneratedAboutService } from "../services/aboutService.js";
import { validateAboutQuery } from "../models/aboutModels.js";
import { getBearerToken } from "../utils/auth.js";

export async function getGeneratedAbout(req, res, next) {
	try {
		const token = getBearerToken(req);

		const query = validateAboutQuery({
			github: req.query.github,
			lang: req.query.lang,
			tone: req.query.tone,
		});

		const result = await getGeneratedAboutService({
			token,
			github: query.github,
			lang: query.lang,
			tone: query.tone,
		});

		res.json(result);
	} catch (err) {
		next(err);
	}
}
