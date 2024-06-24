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
    apiKey: process.env.OPENAI_API_KEY // A chave da API é uma string
});
async function fetchChatGPTResponse(instrucao) {
    try {
        const params = {
            messages: [{ role: 'user', content: `${instrucao}` }],
            model: 'gpt-4-0125-preview',
        };
        const chatCompletion = (await openai.chat.completions.create(params));
        const chatMessage = chatCompletion.choices[0].message;
        return chatMessage.content;
    }
    catch (error) {
        console.error("Erro ao buscar resposta do ChatGPT:", error);
        throw error;
    }
}
exports.fetchChatGPTResponse = fetchChatGPTResponse;
async function askOpenAI(req, res) {
    const answer = req.body.answer;
    const reportId = req.body.reportId;
    const userId = req.body.userID;
    const environment = req.body.environment;
    console.log("Entrou na rota com o novo domínio");
    if (!answer) {
        return res.status(400).send({ error: "Pergunta não fornecida." });
    }
    try {
        const chatResponse = await fetchChatGPTResponse(answer);
        const chatData = {
            reportId: reportId,
            userID: userId,
            chatResponse: chatResponse,
        };
        if (environment === "dev") {
            (0, pocketBaseController_1.sendChatTestRequest)(chatData);
            (0, pocketBaseController_1.sendPlanningEmailRequestTest)(userId);
            console.log("enviado para dev");
        }
        else if (environment === "prod" || environment === "") {
            (0, pocketBaseController_1.sendChatRequest)(chatData);
            (0, pocketBaseController_1.sendStrategicPlanningEmailRequestProd)(userId);
            console.log("enviado para prod");
        }
        res.status(200).send({ content: chatResponse });
    }
    catch (error) {
        res.status(500).send({ error: "Erro ao processar sua pergunta." });
    }
}
exports.askOpenAI = askOpenAI;
