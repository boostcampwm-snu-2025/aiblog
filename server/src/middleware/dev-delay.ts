import type { RequestHandler } from "express";
import { sleep } from "../utils/sleep.js";

export const devDelayMiddleware = (ms = 3000): RequestHandler => {
	return async (_req, _res, next) => {
		await sleep(ms);
		next();
	};
};
