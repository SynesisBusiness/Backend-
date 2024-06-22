import { config } from 'dotenv';
import { ChatCompletion, ChatResponse, GPTParams } from 'interfaces/openAIInterfaces';
import { Request, Response } from 'express';
import OpenAI from 'openai';
import { ChatRequest } from 'interfaces/pocketBaseInterfaces';
import { sendChatRequest, sendChatTestRequest, sendPlanningEmailRequestTest, sendStrategicPlanningEmailRequestProd } from './pocketBaseController';

config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // A chave da API é uma string
});


export async function fetchChatGPTResponse(instrucao: string): Promise<string> {
    try {
        const params: GPTParams = {
            messages: [{ role: 'user', content: `${instrucao}` }],
            model: 'gpt-4-0125-preview',
        };
        const chatCompletion: ChatResponse = (await openai.chat.completions.create(params as any)) as ChatResponse;
        const chatMessage: ChatCompletion = chatCompletion.choices[0].message;

        return chatMessage.content;
    } catch (error) {
        console.error("Erro ao buscar resposta do ChatGPT:", error);
        throw error;
    }
}


export async function askOpenAI(req: Request, res: Response) {
    const answer = req.body.answer;
    const reportId = req.body.reportId;
    const userId = req.body.userID;
    const environment = req.body.environment;

    if (!answer) {
        return res.status(400).send({ error: "Pergunta não fornecida." });
    }

    try {
        const chatResponse = await fetchChatGPTResponse(answer);

        const chatData: ChatRequest = {
            reportId: reportId,
            userID: userId,
            chatResponse: chatResponse,
        };

        if (environment === "dev") {
            sendChatTestRequest(chatData);
            sendPlanningEmailRequestTest(userId);
            console.log("enviado para dev");
        } else if (environment === "prod" || environment === "") {
            sendChatRequest(chatData);
            sendStrategicPlanningEmailRequestProd(userId);
            console.log("enviado para prod");
        }

        res.status(200).send({ content: chatResponse });
    } catch (error) {
        res.status(500).send({ error: "Erro ao processar sua pergunta." });
    }
}
