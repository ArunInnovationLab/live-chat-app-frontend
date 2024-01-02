// import { useRouter } from "next/navigation";
// import React, { useState } from "react";

// function Login() {
//   const [nickname, setNickname] = useState("");
//   const [realName, setRealName] = useState("");

//   const router = useRouter();

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     router.push(`/chat?nickname=${nickname}&realName=${realName}`);
//   };

//   return (
//     <div className="bg-red-900 flex items-center justify-center h-screen ">
//       <div className="bg-white text-black w-96 h-96 rounded-lg shadow-inner shadow-2xl shadow-white">
//         <form
//         //  onSubmit={handleSubmit}
//         >
//           <div className="flex justify-center text-3xl text-center mt-8 font-bold">
//             Enter Chat Room
//           </div>

//           <div className="mt-10 mx-10">
//             <div>
//               <label htmlFor="nick" className="text-2xl">
//                 Nickname<span className="text-red-600">*</span>
//               </label>
//             </div>
//             <div>
//               <input
//                 id="nick"
//                 className="text-2xl w-full border rounded-md py-1 pl-4 border-blue-700"
//                 placeholder="enter nickname"
//                 required
//                 value={nickname}
//                 onChange={(e) => setNickname(e.target.value)}
//               />
//             </div>
//           </div>

//           <div className="mt-6 mx-10">
//             <div>
//               <label htmlFor="real" className="text-2xl">
//                 Real Name<span className="text-red-600">*</span>
//               </label>
//             </div>
//             <div>
//               <input
//                 id="real"
//                 className="text-2xl w-full border rounded-md py-1 pl-4 border-blue-700"
//                 placeholder="enter real name"
//                 required
//                 value={realName}
//                 onChange={(e) => setRealName(e.target.value)}
//               />
//             </div>
//           </div>

//           <div className="flex justify-center mt-8 mx-10">
//             <button
//               // disabled={!nickname || !realName}
//               type="submit"
//               className="font-bold text-white hover:bg-blue-500 rounded-md bg-blue-800 py-2 w-full "
//             >
//               Enter
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
// export default Login;

import SockJS from "sockjs-client";
import Stomp from "stompjs";
import React, { useState, useEffect } from "react";

interface User {
  nickName: string;
  realName: string;
  status: string;
}

function Login() {
  const [nickname, setNickname] = useState("");
  const [realName, setRealName] = useState("");

  const [stompClient, setStompClient] = useState<any>(null);

  // const connectToWebSocket = () => {
  //   const socket = new SockJS("http://localhost:8081/ws");
  //   const stomp = Stomp.over(socket);

  //   return new Promise<void>((resolve) => {
  //     stomp.connect({}, () => {
  //       console.log("WebSocket connected");

  //       setStompClient(stomp);
  //       subscribeToUserTopic(stomp);
  //       resolve();
  //     });
  //   });
  // };

  const connectToWebSocket = () => {
    const socket = new SockJS("http://localhost:8081/ws");
    const stomp = Stomp.over(socket);
  
    return new Promise((resolve, reject) => {
      stomp.connect(
        {},
        () => {
          console.log("WebSocket connected");
          setStompClient(stomp);
          subscribeToUserTopic(stomp);
          resolve(stomp);
        },
        (error) => {
          console.error("WebSocket connection error:", error);
          reject(error);
        }
      );
    });
  };
  

  const disconnectFromWebSocket = () => {
    if (stompClient) {
      stompClient.disconnect();
    }
  };

  useEffect(() => {
    // connectToWebSocket();

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      disconnectFromWebSocket();
    };
  }, []);

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   await connectToWebSocket();

  //   // stompClient.send(
  //   //   "/app/user.addUser",
  //   //   {},
  //   //   JSON.stringify({
  //   //     nickName: nickname,
  //   //     fullName: realName,
  //   //     status: "ONLINE",
  //   //   })
  //   // );
  //   if (stompClient) {
  //     // Send a message to the server to add the user
  //     stompClient.send(
  //       "/app/user.addUser",
  //       {},
  //       JSON.stringify({
  //         nickName: nickname,
  //         fullName: realName,
  //         status: "ONLINE",
  //       })
  //     );
  //   } else {
  //     console.error("WebSocket connection is null");
  //     // Handle the case where stompClient is null
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    try {
      const connectedStompClient = await connectToWebSocket();
  
      // Send a message to the server to add the user

      if(connectedStompClient){
        stompClient.send(
          "/app/user.addUser",
          {},
          JSON.stringify({
            nickName: nickname,
            fullName: realName,
            status: "ONLINE",
          })
        );
      }
      
  
     
    } catch (error) {
      console.error("Error connecting to WebSocket:", error);
      // Handle the error connecting to WebSocket
    }
  };
  

  const subscribeToUserTopic = (stomp: any) => {
    const userId = nickname; // Assuming nickname is used as the user identifier
    const topic = `/user/${userId}/topic`;

    stomp.subscribe(topic, (message: any) => {
      const user: User = JSON.parse(message.body);
      console.log("Received user object from server:", user);
      // Handle the received user object as needed
    });
  };

  return (
    <div className="bg-red-900 flex items-center justify-center h-screen ">
      <div className="bg-white text-black w-96 h-96 rounded-lg shadow-inner shadow-2xl shadow-white">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center text-3xl text-center mt-8 font-bold">
            Enter Chat Room
          </div>

          <div className="mt-10 mx-10">
            <div>
              <label htmlFor="nick" className="text-2xl">
                Nickname<span className="text-red-600">*</span>
              </label>
            </div>
            <div>
              <input
                id="nick"
                className="text-2xl w-full border rounded-md py-1 pl-4 border-blue-700"
                placeholder="enter nickname"
                required
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-6 mx-10">
            <div>
              <label htmlFor="real" className="text-2xl">
                Real Name<span className="text-red-600">*</span>
              </label>
            </div>
            <div>
              <input
                id="real"
                className="text-2xl w-full border rounded-md py-1 pl-4 border-blue-700"
                placeholder="enter real name"
                required
                value={realName}
                onChange={(e) => setRealName(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-center mt-8 mx-10">
            <button
              // disabled={!nickname || !realName}
              type="submit"
              className="font-bold text-white hover:bg-blue-500 rounded-md bg-blue-800 py-2 w-full "
            >
              Enter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default Login;
