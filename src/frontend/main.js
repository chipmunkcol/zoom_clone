// document element
const ul = document.querySelector("ul");
const button = document.querySelector("button");
const input = document.querySelector("input");

// ws
const ws = new WebSocket("ws://localhost:8080");

// Connection opened
ws.addEventListener("open", (event) => {
  const payload = {
    type: "init",
  };
  const jsonPayload = JSON.stringify(payload);
  ws.send(jsonPayload);
});

// Listen for messages
ws.addEventListener("message", (event) => {
  console.log("Message from server ", event.data);
  const data = event.data;
  const chat = parseJsonData(data);
  const typeCheck = typeof chat;

  switch (typeCheck) {
    case "string":
      addMessageElement(chat);
      break;
    case "object":
      initMessageElement(chat);
      break;
  }
});

function addMessageElement(chat) {
  const li = document.createElement("li");
  li.innerHTML = chat;
  ul.append(li);
}

function initMessageElement(chatRoom) {
  // const chatRoom = parseJsonData(chat);
  if (chatRoom.length < 1) return;

  chatRoom.forEach((chat) => {
    addMessageElement(chat);
  });
}

function parseJsonData(jsonData) {
  return JSON.parse(jsonData);
}

button.addEventListener("click", (e) => {
  e.preventDefault();
  const payload = {
    type: "chat",
    message: input.value,
  };
  const jsonPayload = JSON.stringify(payload);
  ws.send(jsonPayload);
  input.value = "";
});
