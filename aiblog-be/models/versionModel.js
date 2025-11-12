export function validateVersion(v) {
	if (v.length === 0) {
		throw new Error("Invalid version format");
	}
	return true;
}
