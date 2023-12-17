// import { useClient } from "next/client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";
function Login() {
  // Use useClient to mark this component as a client component
  //   useClient();

  const [nickname, setNickname] = useState("");
  const [realName, setRealName] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Your form submission logic here

    // For example, you can store data in a state, local storage, or make an API call

    // After handling the submission, redirect to the homepage
    e.preventDefault();

    router.push("/chat");
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
              type="submit"
              className="font-bold text-white rounded-md hover:bg-blue-500 bg-blue-800 py-2 w-full "
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
