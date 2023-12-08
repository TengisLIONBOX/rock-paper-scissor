import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import Link from "next/link";

export default function Index() {
  const [input, setInput] = useState("");
  const router = useRouter();

  const createGame = () => {
    const gameId = Math.floor(Math.random() * 90000) + 10000;
    router.push(`/multiplayer/${gameId}`);
  };

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replaceAll(" ", "");
    const isUnderFive = value.length <= 5;
    if (!isUnderFive) return;
    if (!Number(value) && value !== "") return;
    setInput(value);
  };

  return (
    <div className="bg-[#9DCAFF] min-h-screen grid place-items-center">
      <div className="flex flex-col gap-4">
        <input
          type="text"
          className="text-center border-4 border-white py-4 text-black"
          placeholder="Enter code"
          value={input}
          onChange={handleChangeInput}
        />
        <button className="border-4 border-white py-4 hover:bg-white hover:text-black duration-300">
          JOIN GAME
        </button>
        <button
          onClick={createGame}
          className="border-4 border-white py-4 hover:bg-white hover:text-black  duration-300"
        >
          CREATE GAME
        </button>
        <Link
          className="border-4 border-white py-4 hover:bg-white hover:text-black duration-300 text-center"
          href="http://localhost:3000/singleplayer"
        >
          VS BOT
        </Link>
      </div>
    </div>
  );
}
