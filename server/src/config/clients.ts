import { GoogleGenAI } from "@google/genai";
import { Octokit } from "octokit";
import env from "./env";

export const octokit: Octokit = new Octokit({
	auth: env.GITHUB_TOKEN,
});

export const ai: GoogleGenAI = new GoogleGenAI({
	apiKey: env.GEMINI_API_KEY,
});
