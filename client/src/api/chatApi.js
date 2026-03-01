import api from "./axios";

export const sendChatMessage = async (messages) => {
  try {
    const response = await api.post("/chat/send", {
      messages,
    });  
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};