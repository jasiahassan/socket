exports.messages = async (req, res) => {
  const { friendUsername, message } = req.body;
  const sender = req.user.name;

  socket.emit("send message", { sender, recipient: friendUsername, message });

  res.send("Message sent successfully");
};
