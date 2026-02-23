import { useState } from "react";
import { uid, PLAYER_COLORS } from "../gameLogic";

const DEFAULT_PLAYERS = [
  { id: uid(), name: "Alice", time: 1 },
  { id: uid(), name: "Bob", time: 2 },
  { id: uid(), name: "Charlie", time: 5 },
  { id: uid(), name: "Dave", time: 10 },
];

export default function SetupScreen({ onStart }) {
  const [players, setPlayers] = useState(DEFAULT_PLAYERS);

  const addPlayer = () => {
    if (players.length >= 10) return;
    setPlayers([...players, { id: uid(), name: "", time: 1 }]);
  };

  const removePlayer = (id) => {
    if (players.length <= 2) return;
    setPlayers(players.filter((p) => p.id !== id));
  };

  const update = (id, field, value) => {
    setPlayers(
      players.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    );
  };

  const canStart = players.every((p) => p.name.trim() && p.time > 0);

  const handleStart = () => {
    if (!canStart) return;
    onStart(
      players.map((p, i) => ({
        ...p,
        name: p.name.trim(),
        time: Number(p.time),
        color: PLAYER_COLORS[i % PLAYER_COLORS.length],
      })),
    );
  };

  return (
    <div className="setup-screen">
      <div className="setup-card">
        <h1 className="setup-title">🌉 Bridge &amp; Torch</h1>
        <p className="setup-subtitle">
          Get everyone across the bridge at night with only one torch!
        </p>

        <div className="rules-box">
          <h3>📜 Rules</h3>
          <ul>
            <li>
              Only <strong>2 players</strong> can cross at a time
            </li>
            <li>
              They must carry the <strong>torch</strong> while crossing
            </li>
            <li>
              Crossing speed = the <strong>slower</strong> player's pace
            </li>
            <li>
              Someone must <strong>bring the torch back</strong> each time
            </li>
          </ul>
        </div>

        <h2 className="section-heading">Players</h2>
        <div className="player-list">
          {players.map((p, i) => (
            <div key={p.id} className="player-row">
              <span
                className="player-dot"
                style={{ background: PLAYER_COLORS[i % PLAYER_COLORS.length] }}
              />
              <input
                className="input-name"
                type="text"
                placeholder={`Player ${i + 1}`}
                value={p.name}
                onChange={(e) => update(p.id, "name", e.target.value)}
              />
              <div className="time-input-group">
                <input
                  className="input-time"
                  type="number"
                  min="1"
                  max="99"
                  value={p.time}
                  onChange={(e) =>
                    update(p.id, "time", Math.max(1, +e.target.value || 1))
                  }
                />
                <span className="time-unit">min</span>
              </div>
              <button
                className="btn-remove"
                onClick={() => removePlayer(p.id)}
                disabled={players.length <= 2}
                title="Remove player"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="setup-actions">
          <button
            className="btn btn-secondary"
            onClick={addPlayer}
            disabled={players.length >= 10}
          >
            + Add Player
          </button>
          <button
            className="btn btn-primary"
            onClick={handleStart}
            disabled={!canStart}
          >
            Start Game 🔦
          </button>
        </div>
      </div>
    </div>
  );
}
