"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const openAIController_1 = require("../controllers/openAIController");
const openAIController_2 = require("../controllers/openAIController");
const openAIRoutes = (0, express_1.Router)();
openAIRoutes.post("/ask", openAIController_1.askOpenAI);
openAIRoutes.post("/ask/growth_plan", openAIController_2.growthPlan);
exports.default = openAIRoutes;
