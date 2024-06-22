import { Router } from 'express';
import { askOpenAI } from '../controllers/openAIController'; 

const openAIRoutes = Router();

openAIRoutes.post("/ask", askOpenAI);

export default openAIRoutes;
