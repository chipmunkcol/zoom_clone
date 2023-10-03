// 기본 설정
import express from "express";
import path from "path";
import { WebSocket, WebSocketServer } from "ws";

const app = express();
const PORT = 3000;

// 정적 파일 불러오기
const frontPath = path.join(__dirname, "../frontend");
app.use(express.static(frontPath));

// 라우팅 정의
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: frontPath });
});

// webSocketServer
const wss = new WebSocketServer({ port: 8080 });

const chatRoom = [];
wss.on("connection", function connection(ws) {
  ws.on("error", console.error);

  ws.on("message", function message(data) {
    const decodeData = data.toString();
    const parseData = JSON.parse(decodeData);
    switch (parseData.type) {
      case "chat":
        const message = parseData.message;
        chatRoom.push(message);

        const jsonMessage = stringifyJsonData(message);
        sendMessageToClients(jsonMessage);
        break;
      case "init":
        const jsonChatRoom = stringifyJsonData(chatRoom);
        ws.send(jsonChatRoom);
    }
  });
});

app.listen(PORT, () => {
  console.log("서버 연결");
});

//ws FN
function stringifyJsonData(data) {
  return JSON.stringify(data);
}
function sendMessageToClients(jsonMessage) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(jsonMessage);
    }
  });
}
