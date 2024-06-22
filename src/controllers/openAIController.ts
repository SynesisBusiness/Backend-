import { config } from 'dotenv';
import { ChatCompletion, ChatResponse, GPTParams } from 'interfaces/openAIInterfaces';
import OpenAI from 'openai';

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
