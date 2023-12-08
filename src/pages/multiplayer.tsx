import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import * as Ably from "ably";

const client = new Ably.Realtime(`${process.env.ABLY_API_KEY}`);

type GameItemProps = {
  name: string;
  choice: string;
};

const GameItem: React.FC<GameItemProps> = (props) => {
  const { name, choice } = props;
  return "";
};

type Choice = "rock" | "paper" | "scissors";

const choices: Choice[] = ["rock", "paper", "scissors"];

const outcomes = {
  paper: { rock: 1, paper: 0, scissors: -1 },
  rock: { rock: 0, paper: -1, scissors: 1 },
  scissors: { rock: -1, paper: 1, scissors: 0 },
};

export default function Home() {
  const [started, setStarted] = useState(false);
  const [roundEnded, setRoundEnded] = useState(false);
  const [userChoice, setUserChoice] = useState<Choice | null>(null);
  const [cpuChoice, setCpuChoice] = useState<Choice | null>(null);
  const [timer, setTimer] = useState(10);
  const [title, setTitle] = useState("");
  const [scores, setScores] = useState({ player: 0, player2: 0 });
  const intervalRef = useRef<any>(null);
  const [user2Choice, setUser2Choice] = useState<GameItemProps[]>([]);
  const [user1Choice, setUser1Choice] = useState<GameItemProps[]>([]);
  const [me, setMe] = useState("");

  useEffect(() => {
    if (me === "") {
      const nickname = prompt("Нэрээ оруулна уу");
      setMe(nickname + "");
    }
    client.channels.get("chat").subscribe("message", (message) => {
      setUser1Choice((messages) => [...messages, message.data]);
    });
  }, []);

  console.log(me);

  const handleUserChoice = (choice: Choice) => {
    setUserChoice(choice);
    const cpuRandoms = Math.floor(Math.random() * 3);
    const cpuRandomChoice = choices[cpuRandoms];
    setCpuChoice(cpuRandomChoice);
    winner(choice, cpuRandomChoice);
    setRoundEnded(true);
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
      setScores({ ...scores, player2: scores.player2 + 1 });
    }
  };
  const startTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTimer((timer) => timer - 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(intervalRef.current);
  };

  if (started) startTimer();

  if (roundEnded) stopTimer();

  useEffect(() => {
    if (timer === 0) {
      const playerRandoms = Math.floor(Math.random() * 3);
      const playerRandomChoice = choices[playerRandoms];
      handleUserChoice(playerRandomChoice);
    }
  }, [timer]);

  useEffect(() => {
    const { player2, player } = scores;
    if (player2 === 3 || player === 3) {
    }
  }, [scores]);

  return (
    <div className="h-screen grid place-items-center bg-[#9DCAFF]">
      <div>
        <h1 className="fixed top-8 right-8 text-2xl md:text-4xl">{timer}</h1>
        <h1 className="fixed top-10 right-[30%] text-5xl text-center">
          {scores.player}
          <div className="text-xl">You</div>
        </h1>
        <h1 className="fixed top-10 left-[30%] text-5xl">
          {scores.player2}
          {/* <div className="text-xl">{data.name}</div> */}
        </h1>
        <div className="fixed bottom-50 md:bottom-24 left-[50%] -translate-x-[50%]">
          {started &&
            (!roundEnded ? (
              <>
                <div className="flex items-center justify-center flex-col">
                  <h1 className="text-2xl md:text-4xl text-center">
                    Choose Your Movement
                  </h1>
                  <div className="relative z-50 flex">
                    {choices.map((choice) => (
                      <button
                        key={choice}
                        className="hover:rotate-12 duration-300"
                        onClick={() => handleUserChoice(choice)}
                      >
                        <Image
                          alt={choice}
                          src={`/button-${choice}.png`}
                          width={300}
                          height={300}
                          className="w-[100px] h-[100px] lg:w-[200px] lg:h-[200px]"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                {title && (
                  <h1 className="text-2xl md:text-4xl text-center">{title}</h1>
                )}
                <div className="relative z-50">
                  <div>
                    <div
                      className="border-2 border-white p-4 uppercase text-1xl md:text-3xl cursor-pointer mt-6"
                      onClick={() => {
                        setTimer(10);
                        startTimer();
                        setRoundEnded(false);
                      }}
                    >
                      Next round
                    </div>
                  </div>
                </div>
              </>
            ))}

          {!started && (
            <div>
              <button
                className="border-2 border-white p-2 md:p-4 uppercase text-2xl md:text-3xl cursor-pointer mt-8"
                onClick={() => setStarted(true)}
              >
                start game
              </button>
            </div>
          )}
        </div>
      </div>
      <div
        className="fixed -right-24 z-10 "
        style={{
          transform:
            "scaleX(-1) translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(45deg) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))",
        }}
      >
        <Image
          alt={"player-choice"}
          src={`/human-${userChoice || "rock"}.png`}
          className="duration-300 transition-all w-[250px] h-[430px] md:w-[430px] md:h-[630px] "
          width={520}
          height={970}
        />
      </div>
      <div className="fixed -left-24 z-10 rotate-45">
        <Image
          alt={"bot-choice"}
          className="duration-300 transition-all w-[280px] h-[460px] md:w-[500px] md:h-[700px] "
          src={`/robot-${cpuChoice || "rock"}.png`}
          width={520}
          height={970}
        />
      </div>
    </div>
  );
}
