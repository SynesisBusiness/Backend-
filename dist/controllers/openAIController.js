"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.askOpenAI = exports.fetchChatGPTResponse = void 0;
const dotenv_1 = require("dotenv");
const openai_1 = __importDefault(require("openai"));
const pocketBaseController_1 = require("./pocketBaseController");
(0, dotenv_1.config)();
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
async function fetchChatGPTResponse(instrucao) {
    try {
        const params = {
            messages: [{ role: "user", content: `${instrucao}` }],
            model: "gpt-4-0125-preview",
        };
        const chatCompletion = (await openai.chat.completions.create(params));
        const chatMessage = chatCompletion.choices[0].message;
        return chatMessage.content;
    }
    catch (error) {
        console.error("Error when fetching response from ChatGPT:", error);
        throw error;
    }
}
exports.fetchChatGPTResponse = fetchChatGPTResponse;
async function askOpenAI(req, res) {
    const prompt = req.body.prompt;
    const diagnosisId = req.body.reportId;
    const userId = req.body.userId;
    console.log("askOpenAI route");
    if (!prompt) {
        return res.status(400).send({ error: "Prompt not received" });
    }
    try {
        const chatResponse = await fetchChatGPTResponse(prompt);
        const chatData = {
            diagnosisId: diagnosisId,
            userId: userId,
            chatResponse: chatResponse,
        };
        (0, pocketBaseController_1.diagnosisready)(chatData);
        res.status(200).send({ content: chatResponse });
    }
    catch (error) {
        res.status(500).send({ error: "Error processing your prompt." });
    }
}
exports.askOpenAI = askOpenAI;
