import axios from "axios";
import { ChatRequest } from "interfaces/pocketBaseInterfaces";

export async function diagnosisready(data: ChatRequest): Promise<void> {
  const url =
    "https://synesisbusiness.pockethost.io/api/emails/diagnosticready";
  try {
    await axios.post(url, data);
  } catch (error: any) {
    console.error("Error making request:", error);
  }
}

export async function growthPlanReady(data: ChatRequest): Promise<void> {
  const url =
    "https://synesisbusiness.pockethost.io/api/emails/growth_plan_ready";
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

export async function sendPlanningEmailRequestTest(
  userId: string
): Promise<void> {
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
