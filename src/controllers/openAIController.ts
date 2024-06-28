import { config } from "dotenv";
import {
  ChatCompletion,
  GPTParams,
} from "interfaces/openAIInterfaces";
import { ChatResponse } from "interfaces/openAIInterfaces";
import { Request, Response } from "express";
import OpenAI from "openai";
import { ChatRequest } from "interfaces/pocketBaseInterfaces";
import {
  diagnosisready,
} from "./pocketBaseController";

config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function fetchChatGPTResponse(instrucao: string): Promise<string> {
  try {
    const params: GPTParams = {
      messages: [{ role: "user", content: `${instrucao}` }],
      model: "gpt-4-0125-preview",
    };
    const chatCompletion: ChatResponse = (await openai.chat.completions.create(
      params as any
    )) as ChatResponse;
    const chatMessage: ChatCompletion = chatCompletion.choices[0].message;

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
    const chatResponse = await fetchChatGPTResponse(prompt);

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
