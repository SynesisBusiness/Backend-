"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPlanningEmailRequestTest = exports.sendStrategicPlanningEmailRequestProd = exports.growthPlanReady = exports.diagnosisready = void 0;
const axios_1 = __importDefault(require("axios"));
async function diagnosisready(data) {
    const url = "https://synesisbusiness.pockethost.io/api/emails/diagnosticready";
    try {
        await axios_1.default.post(url, data);
    }
    catch (error) {
        console.error("Error making request:", error);
    }
}
exports.diagnosisready = diagnosisready;
async function growthPlanReady(data) {
    const url = "https://synesisbusiness.pockethost.io/api/emails/growth_plan_ready";
    try {
        await axios_1.default.post(url, data);
    }
    catch (error) {
        console.error("Error making request:", error);
    }
}
exports.growthPlanReady = growthPlanReady;
async function sendStrategicPlanningEmailRequestProd(userId) {
    const url = "https://vconsultoria.pockethost.io/api/emails/planejamentoestrategicogerado";
    const data = {
        userId: userId,
        //token: "nrsu12gatexznv9"
    };
    try {
        const response = await axios_1.default.post(url, data);
        console.log("Request successful:", response.data);
        console.log("Email sent to admin");
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
        console.log("Email sent to admin");
    }
    catch (error) {
        console.error("Error making request:", error);
    }
}
exports.sendPlanningEmailRequestTest = sendPlanningEmailRequestTest;
