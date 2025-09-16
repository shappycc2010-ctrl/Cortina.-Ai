const responses = [
  "Hello! I’m Halobot 🤖, how can I help?",
  "I’m here, listening 👂",
  "Processing your request…⚡",
  "That’s interesting, tell me more!",
  "I’m always ready to chat 💬"
];

function sendMessage() {
  const input = document.getElementById("userInput");
  const msg = input.value.trim();
  if (!msg) return;

  const messages = document.getElementById("messages");

  // Add user message
  const userMsg = document.createElement("div");
  userMsg.className = "user";
  userMsg.textContent = "You: " + msg;
  messages.appendChild(userMsg);

  // Add bot response
  const botMsg = document.createElement("div");
  botMsg.className = "bot";
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  botMsg.textContent = "Halobot: " + randomResponse;
  messages.appendChild(botMsg);

  // Clear input
  input.value = "";
  messages.scrollTop = messages.scrollHeight;
}
