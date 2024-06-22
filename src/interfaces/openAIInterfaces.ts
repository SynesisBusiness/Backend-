export interface GPTParams {
    messages: { role: string; content: string }[];
    model: string;
}

export interface ChatCompletion {
    content: string;
}

export interface ChatResponse {
    choices: { message: ChatCompletion }[];
}