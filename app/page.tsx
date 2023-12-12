import Image from "next/image";
import Link from "next/link";
import { Badge } from "reactstrap";

export default function Home() {
  return (
    <div className="my-auto mx-auto">
      <header className="flex justify-center items-center bg-red-600">
        <p
          className="text-xs md:text-xl xl:text-2xl font-bold text-center text-white"
          style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
        >
          Welcome to the Awesome app!
        </p>

        {/* <div
          style={{
            textAlign: "center",

            color: "#fff",
            fontSize: "28px",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
            // background: "red",
          }}
        >
          <div color="danger">Welcome to the Awesome app!</div>
        </div> */}
      </header>

      <main className="grid grid-cols-4 mt-2 gap-2">
        {/* left sidebar */}
        <section className="bg-blue-500 h-[70vh] rounded-2xl"></section>

        <section className="bg-green-500 h-[70vh] col-span-3 flex justify-center">
          <div className="flex items-end mb-4 w-full max-w-screen-lg">
            <input placeholder="Type your message..." 
            // className="py-4 rounded-lg" 
            // className="py-4 px-2 w-full rounded-lg"
            className="py-3 px-4 w-full rounded-lg border-none focus:outline-none focus:ring focus:border-blue-300 bg-gray-100"

            ></input>
          </div>
        </section>
      </main>
    </div>
  );
}
