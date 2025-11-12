import { getAppVersion } from "../services/versionService.js";
import { delay } from "../utils/delay.js";

export async function getVersion(req, res, next) {
	try {
		await delay(1000);
		const version = await getAppVersion();
		res.json({ version });
	} catch (err) {
		next(err);
	}
}
