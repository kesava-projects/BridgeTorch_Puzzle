import { useState } from "react";
import SetupScreen from "./components/SetupScreen";
import GameScreen from "./components/GameScreen";

export default function App() {
  const [players, setPlayers] = useState(null);

  if (!players) {
    return <SetupScreen onStart={setPlayers} />;
  }

  return <GameScreen players={players} onRestart={() => setPlayers(null)} />;
}
