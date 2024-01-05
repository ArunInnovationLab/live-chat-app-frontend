"use client";

import { useSearchParams } from "next/navigation";
import SockJS from "sockjs-client";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Stomp from "stompjs";
import { useRouter } from "next/navigation";

interface User {
  nickName: string;
  realName: string;
  status: string;
}

const baseURL = "http://localhost:8081";

export default function Chat() {
  const searchParams = useSearchParams();

  const nickname = searchParams?.get("nickname");
  const realName = searchParams?.get("realName");

  const [connectedUsers, setConnectedUsers] = useState<User[]>([]);
  const [senderMessage, setSenderMessage] = useState("");

  const [activeIndex, setActiveIndex] = useState<String | null>(null);

  const [senderMessages, setSenderMessages] = useState<any>([]);

  const [receiverMessages, setReceiverMessages] = useState<any>([]);

  const router = useRouter();

  const [stompClient, setStompClient] = useState<any>(null);
  const socket = new SockJS(`${baseURL}/ws`);

  const connectToWebSocket = () => {
    const stomp = Stomp.over(socket);

    stomp.connect(
      {},
      () => {
        console.log("WebSocket connected");
        setStompClient(stomp);

        subscribeToUserTopics(stomp);

        if (nickname && realName) {
          saveUser(nickname, realName, stomp);
        } else {
          console.error("Nickname or realName is null or undefined");
        }

        //find and display online users
        findAndDisplayConnectedUsers();

        // resolve(stomp);
      },
      (error: any) => {
        console.error("WebSocket connection error:", error);
      }
    );
  };

  const disconnectFromWebSocket = () => {
    if (stompClient) {
      console.log("stomp client : ", stompClient);
      stompClient.disconnect();
      setStompClient(null); // Set stompClient to null after disconnecting
      console.log("disconnected web socket");
    }
  };

  useEffect(() => {
    connectToWebSocket();

    // Clean up the WebSocket connection when the component unmounts
    // return () => {
    //   disconnectFromWebSocket();
    // };
  }, [nickname, realName]);

  const subscribeToUserTopics = (stomp: any) => {
    const userId = nickname; // use same label 'userId' as specified in destination channel at server
    const topic1 = `/user/${userId}/topic`;

    const topic2 = `/user/${userId}/queue/messages`;

    stomp.subscribe(topic1, (message: any) => {
      const user: User = JSON.parse(message.body);
      console.log("Received user object from server:", user);
    });

    stomp.subscribe(topic2, async (message: any) => {
      console.log("before invoking function");
      await findAndDisplayConnectedUsers(); // Ensure proper handling of asynchronous operations

      const receivedFrame = JSON.parse(message.body);
      const content = receivedFrame.content;
      // setReceiverMessages((prevData) => {
      //   return [...prevData, content];
      // });

      setReceiverMessages((prevData: any) => {
        return [
          ...prevData,
          { content: content.content, timestamp: content.timestamp },
        ];
      });

      console.log("content.........", content);
      console.log("after invoking findAndDisplayConnectedUsers");
      console.log("received messages on subscriptionsjhdjsgdh ", message);
    });
  };

  async function findAndDisplayConnectedUsers() {
    const connectedUsrsResponse = await fetch(`${baseURL}/users`);
    const connectedUsrs: User[] = await connectedUsrsResponse.json();
    const filteredUsers: User[] = connectedUsrs.filter(
      (user: User) => user.nickName !== nickname
    );
    setConnectedUsers(filteredUsers);
    console.log("filtered users", filteredUsers);
  }

  async function fetchAndDisplayUserChat(selectedUserId: string) {
    const userChatResponse = await fetch(
      `${baseURL}/messages/${nickname}/${selectedUserId}`
    );
    const userChat = await userChatResponse.json();
    userChat.forEach((chat: any) => {
      if (chat.senderId === selectedUserId) {
        setReceiverMessages((prevData: any) => {
          return [
            ...prevData,
            { content: chat.content, timestamp: chat.timestamp },
          ];
        });
      } else {
        setSenderMessages((prevData: any) => {
          return [
            ...prevData,
            { content: chat.content, timestamp: chat.timestamp },
          ];
        });
      }

      console.log(
        "chat.senderId, chat.content, chat.timestamp",
        chat.senderId,
        chat.content,
        chat.timestamp
      );
    });
    console.log("user chattttt : ", userChat);
  }

  const sendMessage = () => {
    if (senderMessage.trim() !== "") {
      // Add the message to the list of messages
      // setSenderMessages([...senderMessages, senderMessage]);

      const chatMessage = {
        senderId: nickname,
        recipientId: activeIndex,
        content: senderMessage,
        timestamp: new Date(),
      };

      console.log("stomp client in send message function ", stompClient);

      stompClient.send("/app/chat", {}, JSON.stringify(chatMessage));

      // Clear the input field
      // setSenderMessage("");
    }
  };

  const saveUser = (nickname: string, realName: string, stomp: any) => {
    if (stomp) {
      setStompClient(stomp);
      if (nickname && realName) {
        console.log("stompppppppp", stomp);
        stomp.send(
          "/app/user.addUser",
          {},
          JSON.stringify({
            nickName: nickname,
            fullName: realName,
            status: "ONLINE",
          })
        );
      } else {
        console.error("Nickname or realName is null");
      }
    } else {
      console.error("Stomp client is null");
    }
  };

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

        <button
          onClick={() => {
            disconnectFromWebSocket();
            router.push("/");
          }}
          className="text-white"
        >
          Logout
        </button>
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
              <li
                key={user.nickName}
                className={`text-white py-4 text-center mt-1 rounded  hover:bg-slate-500 focus:bg-slate-500 font-bold ${
                  activeIndex === user.nickName ? "bg-slate-500" : "bg-red-300"
                }`}
                onClick={() => {
                  setActiveIndex(user.nickName);
                  fetchAndDisplayUserChat(user.nickName);
                }}
              >
                {user.nickName}
              </li>
            ))}
          </ul>
        </section>

        {/* chat section */}

        {activeIndex ? (
          <section className="bg-green-500 col-span-3 flex flex-col justify-between overflow-scroll">
            <div className="flex flex-col  overflow-y-scroll">
              {receiverMessages.map((msg: any, index: any) => (
                <div
                  key={index}
                  className="text-white font-black ml-6 mb-2 text-left"
                >
                  {activeIndex}
                  {": "} {msg.content}
                </div>
              ))}

              {senderMessages.map((msg: any, index: any) => (
                <div
                  key={index}
                  className="text-white font-bold mb-2 mr-6 text-right"
                >
                  {msg.content}
                  {" :"}
                  {nickname}
                </div>
              ))}
            </div>

            {/* Message input */}
            <div className="flex items-end mx-auto w-[70%] mb-8">
              <input
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    setSenderMessages((prevData: any) => {
                      return [
                        ...prevData,
                        { content: senderMessage, timestamp: new Date() },
                      ];
                    });
                    sendMessage();
                    setSenderMessage("");
                  }
                }}
                value={senderMessage}
                onChange={(e) => setSenderMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-3/4 px-4 py-2 border rounded-md border-blue-900 bg-gray-200 focus:outline-none focus:ring focus:border-blue-900"
              />
              <button
                onClick={() => {
                  setSenderMessages((prevData: any) => {
                    return [
                      ...prevData,
                      { content: senderMessage, timestamp: new Date() },
                    ];
                  });
                  sendMessage();

                  setSenderMessage("");
                }}
                type="button"
                className="w-1/4 ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-900 focus:bg-blue-500 border-blue-500"
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
