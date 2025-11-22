import type { ErrorRequestHandler } from "express";
import { RequestError } from "octokit";
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
	if (error instanceof ZodError) {
		return res.status(400).json({
			error: "Validation failed",
			details: error.issues,
		});
	}

	if (error instanceof RequestError) {
		const status = error.status;
		const message = error.message;
		return res.status(status).json({
			error: message,
		});
	}

	if (error.code === "ENOENT") {
		return res.status(404).json({
			error: "Resource not found",
		});
	}

	console.error("Unexpected error:", error);
	return res.status(500).json({
		error: "Internal server error",
	});
};
