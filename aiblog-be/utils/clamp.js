export function clamp(n, min, max) {
	const x = Number(n) || min;
	return Math.max(min, Math.min(max, x));
}
