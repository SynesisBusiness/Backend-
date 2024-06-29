import { config } from "dotenv";
import { ChatCompletion, GPTParams } from "interfaces/openAIInterfaces";
import { ChatResponse } from "interfaces/openAIInterfaces";
import { Request, Response } from "express";
import OpenAI from "openai";
import { ChatRequest } from "interfaces/pocketBaseInterfaces";
import { diagnosisready } from "./pocketBaseController";
import { growthPlanReady } from "./pocketBaseController";
const PocketBase = require("pocketbase/cjs");
import axios from "axios";
import fs from "fs";
import path from "path";
import ExcelJS from "exceljs";
import csvtojson from "csvtojson";

const pb = new PocketBase("https://synesisbusiness.pockethost.io");

config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function XLS to CSV using exceljs
async function convertXlsToCsv(
  xlsFilePath: string,
  csvFilePath: string
): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(xlsFilePath);
  const worksheet = workbook.getWorksheet(1);
  const csvStream = fs.createWriteStream(csvFilePath);
  await workbook.csv.write(csvStream);
}

// Function CSV to JSON
async function convertCsvToJson(csvFilePath: string): Promise<any[]> {
  const jsonArray = await csvtojson().fromFile(csvFilePath);
  return jsonArray;
}

// Unify the file conversions
async function convertXlsToJson(xlsFilePath: string): Promise<any[]> {
  const csvFilePath = path.join(__dirname, "temp.csv");
  await convertXlsToCsv(xlsFilePath, csvFilePath);
  const jsonArray = await convertCsvToJson(csvFilePath);
  fs.unlinkSync(csvFilePath);
  return jsonArray;
}

export async function fetchChatGPTResponse(
  instrucao: string,
  excelFilePath: string
): Promise<string> {
  try {
    // Convertendo o arquivo XLS para JSON
    const jsonArray = await convertXlsToJson(excelFilePath);
    const jsonContent = JSON.stringify(jsonArray);
    const prompt = `${instrucao}\n\n${jsonContent}`;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );
    const chatMessage: ChatCompletion = response.data.choices[0].message;
    return chatMessage.content;
  } catch (error) {
    console.error("Error when fetching response from ChatGPT:", error);
    throw error;
  }
}

export async function askOpenAI(req: Request, res: Response) {
  const prompt = req.body.prompt;
  const diagnosisId = req.body.diagnosisId;
  const userId = req.body.userId;
  console.log("askOpenAI route");

  if (!prompt) {
    return res.status(400).send({ error: "Prompt not received" });
  }

  try {
    const chatResponse = await fetchChatGPTResponse(prompt, "");

    const chatData: ChatRequest = {
      diagnosisId: diagnosisId,
      userId: userId,
      chatResponse: chatResponse,
    };
    diagnosisready(chatData);

    res.status(200).send({ content: chatResponse });
  } catch (error) {
    res.status(500).send({ error: "Error processing your prompt." });
  }
}

export async function growthPlan(req: Request, res: Response): Promise<void> {
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
    const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
    const filePath = path.join(__dirname, "downloads", firstFilename);
    fs.writeFileSync(filePath, response.data);

    const chatResponse = await fetchChatGPTResponse(prompt, filePath);

    // Delete the file after use
    fs.unlinkSync(filePath);

    const chatData: ChatRequest = {
      diagnosisId: growth_plan_id,
      userId: userId,
      chatResponse: chatResponse,
    };
    console.log("chatData: ", chatData);
    growthPlanReady(chatData);

    res.status(200).send({ content: chatResponse });
  } catch (error) {
    console.error("Error processing your request:", error);
    res.status(500).send({ error: "Error processing your request." });
  }
}
