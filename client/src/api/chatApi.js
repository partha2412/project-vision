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

export const embed_all_Products = async ()=>{
  try{
    const response = await api.post("/chat/embed_all_Products");
    return response.data;
  }
  catch(err){
    return response.message;
  }
}