"use client"

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  nickName: string;
  realName: string;
  status: string;
}

function Login() {
  const [nickname, setNickname] = useState("");
  const [realName, setRealName] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/chat?nickname=${nickname}&realName=${realName}`);
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
