import Link from "next/link";

export default function Home() {
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
        <section className="bg-blue-500 "></section>

        {/* chat section */}
        <section className="bg-green-500 col-span-3 flex justify-center">
          {/* <div className="flex items-end mb-4 w-full max-w-screen-lg">
            <input
              placeholder="Type your message..."
              className="py-3 px-4 w-full rounded-lg border-none focus:outline-none focus:ring focus:border-blue-300 bg-gray-100"
            ></input>
          </div> */}

          {/* <div className="flex justify-around mb-8 items-end w-[70%]">
            <input placeholder="type your message..." className="w-full px-4 py-2 border rounded-md border-blue-900 bg-stone-200" />
            <button type="submit">send</button>
          </div> */}




{/* message input  */}
          <div className="flex justify-between items-end w-[70%] mb-8">
            <input
              placeholder="Type your message..."
              // className="w-4/5 px-4 py-2 border rounded-md border-blue-900 bg-stone-200"
              className="w-3/4 px-4 py-2 border rounded-md border-blue-900 bg-gray-200 focus:outline-none focus:ring focus:border-blue-300"
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
