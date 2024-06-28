import { Router } from "express";
import { askOpenAI } from "../controllers/openAIController";
import { growthPlan } from "../controllers/openAIController";

const openAIRoutes = Router();

openAIRoutes.post("/ask", askOpenAI);
openAIRoutes.post("/ask/growth_plan", growthPlan);

export default openAIRoutes;
