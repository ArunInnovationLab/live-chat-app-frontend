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

      <main className="grid grid-cols-4 md:mt-2 md:gap-2">
        <section className="bg-blue-500 h-[70vh]"></section>

        <section className="bg-green-500 h-[70vh] col-span-3 flex justify-center">
          <div className="flex items-end mb-4 w-full max-w-screen-lg">
            <input
              placeholder="Type your message..."
              className="py-3 px-4 w-full rounded-lg border-none focus:outline-none focus:ring focus:border-blue-300 bg-gray-100"
            ></input>
          </div>
        </section>
      </main>
    </div>
  );
}
