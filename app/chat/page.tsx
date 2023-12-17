"use client";

import { useSearchParams } from "next/navigation";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { useEffect, useState } from "react";

interface User {
  nickName: string;
  realName: string;
}

export default function Chat() {
  const searchParams = useSearchParams();

  const nickname = searchParams?.get("nickname");
  const realName = searchParams?.get("realName");

  const [connectedUsers, setConnectedUsers] = useState<User[]>([]);

  useEffect(() => {
    // Call connectUser when the component mounts
    connectUser();
    findAndDisplayConnectedUsers();

    // Cleanup function (optional)
    return () => {
      // Perform cleanup if needed (e.g., disconnecting from the socket)
    };
  }, []); // Empty dependency array means this effect runs once when the component mounts

  const connectUser = () => {
    // Your form submission logic here

    // For example, you can store data in a state, local storage, or make an API call

    // After handling the submission, redirect to the homepage

    const socket = new SockJS("http://localhost:8081/ws");
    const stompClient = Stomp.over(socket);

    stompClient.connect(
      {},

      //on user connected
      () => {
        stompClient.subscribe(
          `/user/${nickname}/queue/messages`,

          //on message received
          () => {}
        );

        stompClient.subscribe(
          `user/public`,

          //on message received
          () => {}
        );

        //register the connected user
        stompClient.send(
          "app/user.addUser",
          {},
          JSON.stringify({
            nickName: nickname,
            fullName: realName,
            status: "ONLINE",
          })
        );
      },

      //on error
      () => {}
    );
  };

  // find and display connected users
  async function findAndDisplayConnectedUsers() {
    const connectedUsersResponse = await fetch("/users");
    const connectedUsers: User[] = await connectedUsersResponse.json();
    const filteredUsers: User[] = connectedUsers.filter(
      (user: User) => user.nickName !== nickname
    );
  }

  return (
    <div className="md:m-2">
      <header className="flex justify-center items-center bg-red-600">
        <p
          className="py-4 text-base sm:text-lg md:text-xl xl:text-2xl font-bold text-center text-white"
          style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
        >
          Welcome to the Awesome app!
        </p>
      </header>

      <main className="grid grid-cols-4 md:mt-2 md:gap-2 h-[75vh]">
        {/* members section  */}
        <section className="bg-blue-500 ">
          <h2 className="text-white text-lg font-bold mt-4 mb-2">
            Connected Users
          </h2>
          <ul>
            {connectedUsers.map((user) => (
              <li key={user.nickName} className="text-white">
                {user.realName}
              </li>
            ))}
          </ul>
        </section>

        {/* chat section */}
        <section className="bg-green-500 col-span-3 flex justify-center">
          {/* message input  */}
          <div className="flex justify-between items-end w-[70%] mb-8">
            <input
              placeholder="Type your message..."
              // className="w-4/5 px-4 py-2 border rounded-md border-blue-900 bg-stone-200"
              className="w-3/4 px-4 py-2 border rounded-md border-blue-900 bg-gray-200 focus:outline-none focus:ring focus:border-blue-900"
            />
            <button
              type="submit"
              className="w-1/5 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-900 border-blue-500"
            >
              Send
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
