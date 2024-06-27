import axios from "axios";

interface ChatRequest {
    reportId: string;
    userID: string;
    chatResponse: string;
  }
  
export async function sendChatRequest(data: ChatRequest): Promise<void> {
    const url = "https://vconsultoria.pockethost.io/api/chat";
    try {
      await axios.post(url, data);
    } catch (error: any) {
      console.error("Error making request:", error);
    }
  }

  export async function sendChatTestRequest(data: ChatRequest): Promise<void> {
    const url = "https://test-lab-vconsultoria.pockethost.io/api/openai_chat";
    try {
      await axios.post(url, data);
    } catch (error: any) {
      console.error("Error making request:", error);
    }
  }

  export async function sendStrategicPlanningEmailRequestProd(
    userId: string
  ): Promise<void> {
    const url =
      "https://vconsultoria.pockethost.io/api/emails/planejamentoestrategicogerado";
    const data = {
      userId: userId, 
      //token: "nrsu12gatexznv9" 
    };

    try {
      const response = await axios.post(url, data);
      console.log("Request successful:", response.data);
      console.log("Email sent to admin");
    } catch (error: any) {
      console.error("Error making request:", error.message || error);
    }
  }

  export async function sendPlanningEmailRequestTest(userId: string): Promise<void> {
    const url =
      "https://test-lab-vconsultoria.pockethost.io/api/emails/planejamentoestrategicogerado";
    try {
      const response = await axios.post(url, userId);
      console.log("Request successful:", response.data);
      console.log("Email sent to admin");
    } catch (error: any) {
      console.error("Error making request:", error);
    }
  }