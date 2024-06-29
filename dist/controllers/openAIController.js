"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.growthPlan = exports.askOpenAI = exports.fetchChatGPTResponse = void 0;
const dotenv_1 = require("dotenv");
const openai_1 = __importDefault(require("openai"));
const pocketBaseController_1 = require("./pocketBaseController");
const pocketBaseController_2 = require("./pocketBaseController");
const PocketBase = require("pocketbase/cjs");
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const exceljs_1 = __importDefault(require("exceljs"));
const csvtojson_1 = __importDefault(require("csvtojson"));
const pb = new PocketBase("https://synesisbusiness.pockethost.io");
(0, dotenv_1.config)();
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
// Function XLS to CSV using exceljs
async function convertXlsToCsv(xlsFilePath, csvFilePath) {
    const workbook = new exceljs_1.default.Workbook();
    await workbook.xlsx.readFile(xlsFilePath);
    const worksheet = workbook.getWorksheet(1);
    const csvStream = fs_1.default.createWriteStream(csvFilePath);
    await workbook.csv.write(csvStream);
}
// Function CSV to JSON
async function convertCsvToJson(csvFilePath) {
    const jsonArray = await (0, csvtojson_1.default)().fromFile(csvFilePath);
    return jsonArray;
}
// Unify the file conversions
async function convertXlsToJson(xlsFilePath) {
    const csvFilePath = path_1.default.join(__dirname, "temp.csv");
    await convertXlsToCsv(xlsFilePath, csvFilePath);
    const jsonArray = await convertCsvToJson(csvFilePath);
    fs_1.default.unlinkSync(csvFilePath);
    return jsonArray;
}
async function fetchChatGPTResponse(instrucao, excelFilePath) {
    try {
        // Convertendo o arquivo XLS para JSON
        const jsonArray = await convertXlsToJson(excelFilePath);
        const jsonContent = JSON.stringify(jsonArray);
        const prompt = `${instrucao}\n\n${jsonContent}`;
        const response = await axios_1.default.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
        }, {
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
        });
        const chatMessage = response.data.choices[0].message;
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
    const diagnosisId = req.body.diagnosisId;
    const userId = req.body.userId;
    console.log("askOpenAI route");
    if (!prompt) {
        return res.status(400).send({ error: "Prompt not received" });
    }
    try {
        const chatResponse = await fetchChatGPTResponse(prompt, "");
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
async function growthPlan(req, res) {
    const prompt = req.body.prompt;
    const growth_plan_id = req.body.growthPlanId;
    const userId = req.body.userId;
    console.log("growthPlan route");
    if (!prompt) {
        res.status(400).send({ error: "Prompt not received" });
        return;
    }
    try {
        const result = await pb.collection("analytics_excel").getList(1, 1, {
            filter: `user="${userId}"`,
            sort: "-created",
        });
        console.log("result: ", result);
        if (result.items.length === 0) {
            res.status(404).send({ error: "No record found for the given userId" });
            return;
        }
        const record = result.items[0];
        console.log("record: ", record);
        const firstFilename = record.file;
        console.log("firstFilename: ", firstFilename);
        const fileUrl = pb.files.getUrl(record, firstFilename, {
            thumb: "100x300",
            download: "1",
        });
        console.log("fileUrl: ", fileUrl);
        // Downloading the file
        const response = await axios_1.default.get(fileUrl, { responseType: "arraybuffer" });
        const filePath = path_1.default.join(__dirname, "../downloads", firstFilename);
        fs_1.default.writeFileSync(filePath, response.data);
        const chatResponse = await fetchChatGPTResponse(prompt, filePath);
        // Delete the file after use
        fs_1.default.unlinkSync(filePath);
        const chatData = {
            diagnosisId: growth_plan_id,
            userId: userId,
            chatResponse: chatResponse,
        };
        console.log("chatData: ", chatData);
        (0, pocketBaseController_2.growthPlanReady)(chatData);
        res.status(200).send({ content: chatResponse });
    }
    catch (error) {
        console.error("Error processing your request:", error);
        res.status(500).send({ error: "Error processing your request." });
    }
}
exports.growthPlan = growthPlan;
