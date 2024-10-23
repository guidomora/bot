import OpenAI from "openai";
import { envs } from "../config/envs";

const config = envs.OPEN_AI
const projectId = envs.PROJECT_ID

export const openai = new OpenAI({
    apiKey: config,
    project: projectId
});