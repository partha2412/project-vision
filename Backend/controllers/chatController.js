



// Sending chat to Backend
export const sendChatMessage = (req, res) => {
  console.log(req.body);
  res.status(200).json({ message: "Chat message sent successfully" });
}

