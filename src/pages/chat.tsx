import { useEffect, useState } from "react";
import * as Ably from "ably";
import React from "react";

const client = new Ably.Realtime(`${process.env.ABLY_API_KEY}`);

type ChatItemProps = {
  sender: string;
  message: string;
};
const ChatItem: React.FC<ChatItemProps> = (props) => {
  const { sender, message } = props;
  return (
    <div className="chat-item my-4">
      <span className="text-green-500 mr-4">{sender}:</span>
      <span className=" text-white">{message.trim()}</span>
    </div>
  );
};

export default function ChatScreen() {
  const [me, setMe] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatItemProps[]>([]);
  const bottomRef = React.useRef<HTMLDivElement>(null);

  const handleSendMessage = (userInput: string) => {
    if (userInput === "" || userInput === " ") return;
    client.channels
      .get("chat")
      .publish("message", { sender: me, message: userInput });
  };

  console.log(messages);

  useEffect(() => {
    if (me === "") {
      const nickname = prompt("Нэрээ оруулна уу");
      setMe(nickname + "");
    }
    client.channels.get("chat").subscribe("message", (message) => {
      setMessages((messages) => [...messages, message.data]);
    });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="bg-black h-screen w-full p-5 pb-28">
      <div className="h-full overflow-auto w-full">
        {messages.map((message, index) => (
          <ChatItem
            sender={message.sender}
            message={message.message}
            key={`chat-item-${index}`}
          />
        ))}
        <div ref={bottomRef} />
      </div>
      <textarea
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSendMessage(message);
            setMessage("");
            return false;
          }
        }}
        autoFocus
        className="fixed left-4 right-4 bottom-4 h-24 bg-gray-800 text-white p-2 rounded-lg resize-none"
      />
    </div>
  );
}
