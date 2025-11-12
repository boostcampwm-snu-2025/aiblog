import { findVersion } from "../repositories/versionRepository.js";
import { validateVersion } from "../models/versionModel.js";

export async function getAppVersion() {
	const version = await findVersion();
	validateVersion(version);
	return version;
}
