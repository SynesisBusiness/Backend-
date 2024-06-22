"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPlanningEmailRequestTest = exports.sendStrategicPlanningEmailRequestProd = exports.sendChatTestRequest = exports.sendChatRequest = void 0;
const axios_1 = __importDefault(require("axios"));
async function sendChatRequest(data) {
    const url = "https://vconsultoria.pockethost.io/api/chat";
    try {
        const response = await axios_1.default.post(url, data);
    }
    catch (error) {
        console.error("Error making request:", error);
    }
}
exports.sendChatRequest = sendChatRequest;
async function sendChatTestRequest(data) {
    const url = "https://test-lab-vconsultoria.pockethost.io/api/openai_chat";
    try {
        const response = await axios_1.default.post(url, data);
    }
    catch (error) {
        console.error("Error making request:", error);
    }
}
exports.sendChatTestRequest = sendChatTestRequest;
async function sendStrategicPlanningEmailRequestProd(userId) {
    const url = "https://vconsultoria.pockethost.io/api/emails/planejamentoestrategicogerado";
    const data = {
        userId: userId, // Assumindo que você quer enviar o userId como parte do corpo
        //token: "nrsu12gatexznv9" // Ajuste o campo conforme necessário para seu endpoint
    };
    try {
        const response = await axios_1.default.post(url, data);
        console.log("Request successful:", response.data);
        console.log("Email enviado para admin");
    }
    catch (error) {
        console.error("Error making request:", error.message || error);
    }
}
exports.sendStrategicPlanningEmailRequestProd = sendStrategicPlanningEmailRequestProd;
async function sendPlanningEmailRequestTest(userId) {
    const url = "https://test-lab-vconsultoria.pockethost.io/api/emails/planejamentoestrategicogerado";
    try {
        const response = await axios_1.default.post(url, userId);
        console.log("Request successful:", response.data);
        console.log("Email enviado para admin");
    }
    catch (error) {
        console.error("Error making request:", error);
    }
}
exports.sendPlanningEmailRequestTest = sendPlanningEmailRequestTest;
