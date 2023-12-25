"use client";

import { useSearchParams } from "next/navigation";
import SockJS from "sockjs-client";
import { CompatClient, Stomp } from "@stomp/stompjs";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

interface User {
  nickName: string;
  realName: string;
}

const baseURL = "http://localhost:8081";

export default function Chat() {
  const searchParams = useSearchParams();

  const [stompClient, setStompClient] = useState<CompatClient | null>(null);

  const nickname = searchParams?.get("nickname");
  const realName = searchParams?.get("realName");

  const [connectedUsers, setConnectedUsers] = useState<User[]>([]);
  const socket = new SockJS(`${baseURL}/ws`);
  const [senderMessage, setSenderMessage] = useState("");
  const [senderMessages, setSenderMessages] = useState<String[]>([]);

  const [receiverMessage, setReceiverMessage] = useState("");
  const [receiverMessages, setReceiverMessages] = useState<String[]>([]);
  const [activeIndex, setActiveIndex] = useState<String | null>(null);

  const handleSend = () => {
    if (senderMessage.trim() !== "") {
      // Add the message to the list of messages
      setSenderMessages([...senderMessages, senderMessage]);

      const chatMessage = {
        senderId: nickname,
        recipientId: activeIndex,
        content: senderMessage,
        timestamp: new Date(),
      };

      stompClient?.send("/app/chat", {}, JSON.stringify(chatMessage));

      // Clear the input field
      setSenderMessage("");
    }
  };

  useEffect(() => {
    connectUser();
    findAndDisplayConnectedUsers();
  }, [nickname, realName]);

  const connectUser = () => {
    const client = Stomp.over(socket);
    client.connect(
      {},

      //on user connected
      () => {
        setStompClient(client);
        client.subscribe(
          `/user/${nickname}/queue/messages`,

          //on message received
          (payload) => {
            onMessageReceived(payload);
          }
        );

        client.subscribe(
          "user/public",

          //on message received
          () => {}
        );

        //register the connected user
        client.send(
          "/app/user.addUser",
          {},
          JSON.stringify({
            nickName: nickname,
            fullName: realName,
            status: "ONLINE",
          })
        );

        console.log("usr added ");
        toast.success("Connected!");
      },

      //on error
      // () => {}
      () => {
        console.error("WebSocket connection error:");
      }
    );
  };

  // find and display connected users
  async function findAndDisplayConnectedUsers() {
    const connectedUsrsResponse = await fetch(`${baseURL}/users`);
    const connectedUsrs: User[] = await connectedUsrsResponse.json();
    const filteredUsers: User[] = connectedUsrs.filter(
      (user: User) => user.nickName !== nickname
    );
    setConnectedUsers(filteredUsers);
    console.log(filteredUsers);
  }

  // find and display user chat
  async function findAndDisplayUserChat() {
    const userChatResponse = await fetch(
      `${baseURL}/messages/${nickname}/${activeIndex}`
    );
    const userChat = await userChatResponse.json();

    const senderMessages = userChat.filter(
      (chat: any) => chat.nickName === nickname
    );

    const receiverMessages = userChat.filter(
      (chat: any) => chat.nickName !== nickname
    );

    setSenderMessages([...senderMessages, senderMessages]);
  }

  async function onMessageReceived(payload: any) {
    await findAndDisplayConnectedUsers();
    const message = JSON.parse(payload.body);
    setReceiverMessages([...receiverMessages, message.content]);
  }

  return (
    <div className="md:m-2">
      <header className="flex justify-between items-center bg-red-600">
        <p
          style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
          className="text-2xl text-white"
        >
          {" "}
          Hi {nickname} {realName}
        </p>
        <p
          className="py-4 text-base sm:text-lg md:text-xl xl:text-2xl font-bold text-center text-white"
          style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
        >
          Welcome to the Awesome app!
        </p>
      </header>

      <main className="grid grid-cols-4 md:mt-2 md:gap-2 h-[75vh]">
        {/* members section  */}
        <section className="bg-blue-500 overflow-scroll">
          <h2 className="text-white text-center text-lg font-bold mt-4 mb-2">
            Connected Users
          </h2>
          <ul>
            {connectedUsers.map((user) => (
              // <li key={index} className="text-white py-2 bg-black text-center mt-4 hover:bg-slate-500 active:bg-slate-500 focus:bg-slate-500 font-bold">
              //   {user.nickName}
              // </li>
              <li
                key={user.nickName}
                className={`text-white py-4 text-center mt-1 rounded  hover:bg-slate-500 focus:bg-slate-500 font-bold ${
                  activeIndex === user.nickName ? "bg-slate-500" : "bg-red-300"
                }`}
                onClick={() => setActiveIndex(user.nickName)}
              >
                {user.nickName}
              </li>
            ))}
          </ul>
        </section>

        {/* chat section */}

        {activeIndex ? (
          <section className="bg-green-500 col-span-3 flex flex-col justify-center">
            {receiverMessages.map((msg, index) => (
              <div
                key={index}
                className="text-white font-black ml-56 text-left"
              >
                {msg}
              </div>
            ))}

            {senderMessages.map((msg, index) => (
              <div
                key={index}
                className="text-white font-bold mb-4 mr-56 text-right"
              >
                {msg}
              </div>
            ))}

            {/* Message input */}
            <div className="flex items-end mt-auto mx-auto w-[70%] mb-8 ">
              <input
                value={senderMessage}
                onChange={(e) => setSenderMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-3/4 px-4 py-2 border rounded-md border-blue-900 bg-gray-200 focus:outline-none focus:ring focus:border-blue-900"
              />
              <button
                onClick={handleSend}
                type="button" // Change to "submit" if using a form
                className="w-1/4 ml-4 px-4 py-2  bg-blue-500 text-white rounded-md hover:bg-blue-900 border-blue-500"
              >
                Send
              </button>
            </div>
          </section>
        ) : (
          <div
            className="bg-green-500 text-red-700 font-light col-span-3 text-6xl flex flex-col justify-center items-center"
            style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
          >
            Find people and start chatting
          </div>
        )}
      </main>
      <Toaster />
    </div>
  );
}
