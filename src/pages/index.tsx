import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type Choice = "rock" | "paper" | "scissors";

const choices: Choice[] = ["rock", "paper", "scissors"];

const outcomes = {
  paper: { rock: 1, paper: 0, scissors: -1 },
  rock: { rock: 0, paper: -1, scissors: 1 },
  scissors: { rock: -1, paper: 1, scissors: 0 },
};

export default function Home() {
  const [userChoice, setUserChoice] = useState<Choice | null>(null);
  const [cpuChoice, setCpuChoice] = useState<Choice | null>(null);
  const [timer, setTimer] = useState(10);
  const [title, setTitle] = useState("");
  const [scores, setScores] = useState({ player: 0, bot: 0 });
  const intervalRef = useRef<any>(null);

  const handleUserChoice = (choice: Choice) => {
    setUserChoice(choice);
    const cpuRandoms = Math.floor(Math.random() * 3);
    const cpuRandomChoice = choices[cpuRandoms];
    setCpuChoice(cpuRandomChoice);
    winner(choice, cpuRandomChoice);
    setTimer(10);
  };
  const winner = (usr: Choice, cpu: Choice) => {
    const outcome = outcomes[usr][cpu];
    if (outcome === 0) {
      setTitle("Tie");
    }
    if (outcome === 1) {
      setTitle("You won");
      setScores({ ...scores, player: scores.player + 1 });
    }
    if (outcome === -1) {
      setTitle("You lost");
      setScores({ ...scores, bot: scores.bot + 1 });
    }
  };

  if (!intervalRef.current)
    intervalRef.current = setInterval(() => {
      setTimer((timer) => timer - 1);
    }, 1000);

  useEffect(() => {
    if (timer === 0) {
      const playerRandoms = Math.floor(Math.random() * 3);
      const playerRandomChoice = choices[playerRandoms];
      handleUserChoice(playerRandomChoice);
    }
  }, [timer]);

  useEffect(() => {
    const { bot, player } = scores;
    if (bot === 3 || player === 3) {
      setScores({ bot: 0, player: 0 });
    }
  }, [scores]);

  return (
    <div className="h-screen grid place-items-center bg-[#9DCAFF] ">
      <div>
        <h1 className="fixed top-8 right-8 text-4xl">{timer}</h1>
        <div className="gap-[12rem] flex flex-row text-white">
          <div>
            <p className="text-[5rem]">{scores.bot}</p>
            <h1>Bot</h1>
          </div>

          <div>
            <p className="text-[5rem]">{scores.player}</p>
            <h1>You</h1>
          </div>
        </div>

        {title && <h1>{title}</h1>}
      </div>
      <Image
        width={700}
        height={600}
        alt="a"
        className="absolute top-8 left-0 rotate-45 "
        src="/bot-arm.png"
      />
      <Image
        width={700}
        height={600}
        alt="a"
        className="absolute top-8 right-0 rotate-[-45deg]"
        src="/human-arm.png"
      />
      <div className="flex gap-[20px] item-center justify-center">
        <div
          className={`${userChoice !== "scissors" && "opacity-30"} ${
            userChoice === null && "opacity-100"
          }`}
          onClick={() => {
            handleUserChoice("scissors");
          }}
        >
          <Image
            width={500}
            height={500}
            alt="a"
            className="w-[140px] h-[150px] "
            src="/buttonScissors.png"
          />
        </div>
        <div
          className={`${userChoice !== "rock" && "opacity-30"} ${
            userChoice === null && "opacity-100"
          }`}
          onClick={() => {
            handleUserChoice("rock");
          }}
        >
          <Image
            width={500}
            height={500}
            alt="a"
            className="w-[140px] h-[150px] "
            src="/buttonRock.png"
          />
        </div>
        <div
          className={`${userChoice !== "paper" && "opacity-30"} ${
            userChoice === null && "opacity-100"
          }`}
          onClick={() => {
            handleUserChoice("paper");
          }}
        >
          <Image
            width={500}
            height={500}
            alt="a"
            className="w-[140px] h-[150px] "
            src="/buttonPaper.png"
          />
        </div>
      </div>
    </div>
  );
}
