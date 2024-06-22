"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const openAIController_1 = require("../controllers/openAIController");
const openAIRoutes = (0, express_1.Router)();
openAIRoutes.post("/ask", openAIController_1.askOpenAI);
exports.default = openAIRoutes;
