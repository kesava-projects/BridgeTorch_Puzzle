import { useState, useRef } from "react";
import { computeOptimalTime } from "../gameLogic";

/*
  Game phases:
    'select-pair'     – pick 2 players on torch side to cross forward
    'crossing'        – animation: pair moving across bridge
    'select-return'   – pick 1 player on far side to bring torch back
    'returning'        – animation: single player returning
    'done'            – everyone is across
*/

const ANIM_DURATION = 1800; // ms for crossing animation

export default function GameScreen({ players, onRestart }) {
  const [leftBank, setLeftBank] = useState(players.map((p) => p.id));
  const [rightBank, setRightBank] = useState([]);
  const [torchSide, setTorchSide] = useState("left");
  const [elapsed, setElapsed] = useState(0);
  const [phase, setPhase] = useState("select-pair");
  const [selected, setSelected] = useState([]);
  const [crossing, setCrossing] = useState([]); // ids currently on bridge
  const [moveLog, setMoveLog] = useState([]);
  const [animDir, setAnimDir] = useState("forward"); // 'forward' | 'back'
  const optimalTime = useRef(computeOptimalTime(players));
  const playerMap = useRef(Object.fromEntries(players.map((p) => [p.id, p])));

  const p = (id) => playerMap.current[id];

  // ── Selection logic ──────────────────────────────────────────
  const toggleSelect = (id) => {
    if (phase === "select-pair") {
      setSelected((prev) =>
        prev.includes(id)
          ? prev.filter((x) => x !== id)
          : prev.length < 2
            ? [...prev, id]
            : prev,
      );
    } else if (phase === "select-return") {
      setSelected([id]);
    }
  };

  // ── Confirm crossing (forward) ──────────────────────────────
  const confirmCross = () => {
    if (selected.length !== 2) return;
    const [a, b] = selected;
    const cost = Math.max(p(a).time, p(b).time);

    setCrossing(selected);
    setAnimDir("forward");
    setPhase("crossing");

    // Remove from left bank immediately for animation
    setLeftBank((prev) => prev.filter((id) => !selected.includes(id)));

    setTimeout(() => {
      setRightBank((prev) => [...prev, a, b]);
      setElapsed((prev) => prev + cost);
      setTorchSide("right");
      setCrossing([]);
      setSelected([]);
      setMoveLog((prev) => [
        ...prev,
        { type: "cross", names: [p(a).name, p(b).name], cost },
      ]);

      // Check win
      setLeftBank((current) => {
        if (current.length === 0) {
          // use setTimeout so state updates flush first
          setTimeout(() => setPhase("done"), 50);
        } else {
          setTimeout(() => setPhase("select-return"), 50);
        }
        return current;
      });
    }, ANIM_DURATION);
  };

  // ── Confirm return ──────────────────────────────────────────
  const confirmReturn = () => {
    if (selected.length !== 1) return;
    const [ret] = selected;
    const cost = p(ret).time;

    setCrossing([ret]);
    setAnimDir("back");
    setPhase("returning");

    setRightBank((prev) => prev.filter((id) => id !== ret));

    setTimeout(() => {
      setLeftBank((prev) => [...prev, ret]);
      setElapsed((prev) => prev + cost);
      setTorchSide("left");
      setCrossing([]);
      setSelected([]);
      setMoveLog((prev) => [
        ...prev,
        { type: "return", names: [p(ret).name], cost },
      ]);

      setTimeout(() => setPhase("select-pair"), 50);
    }, ANIM_DURATION);
  };

  // ── Render a player token ───────────────────────────────────
  const PlayerToken = ({ id, selectable, isSelected, onClick }) => {
    const pl = p(id);
    return (
      <div
        className={`player-token ${selectable ? "selectable" : ""} ${isSelected ? "selected" : ""}`}
        style={{ "--player-color": pl.color }}
        onClick={selectable ? onClick : undefined}
      >
        <div className="token-avatar" style={{ background: pl.color }}>
          {pl.name[0].toUpperCase()}
        </div>
        <div className="token-info">
          <span className="token-name">{pl.name}</span>
          <span className="token-time">{pl.time}m</span>
        </div>
      </div>
    );
  };

  // ── Which side is selectable? ───────────────────────────────
  const leftSelectable = phase === "select-pair";
  const rightSelectable = phase === "select-return";
  const isAnimating = phase === "crossing" || phase === "returning";

  const resultRating = () => {
    const opt = optimalTime.current;
    if (elapsed === opt)
      return { emoji: "🎉", text: "Perfect! You matched the optimal time!" };
    if (elapsed <= opt * 1.2)
      return { emoji: "👍", text: "Very close to optimal!" };
    return { emoji: "💡", text: "Tip: use the two fastest as torch carriers." };
  };

  return (
    <div className="game-screen">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="game-header">
        <div className="header-left">
          <h1>🌉 Bridge &amp; Torch</h1>
        </div>
        <div className="header-center">
          <div className="timer">⏱ {elapsed} min</div>
          <div className="target">🏆 Optimal: {optimalTime.current} min</div>
        </div>
        <div className="header-right">
          <button className="btn btn-small" onClick={onRestart}>
            ↩ Restart
          </button>
        </div>
      </header>

      {/* ── Phase instruction ──────────────────────────────── */}
      {phase !== "done" && (
        <div className="phase-bar">
          {phase === "select-pair" &&
            "🔦 Select 2 players to cross the bridge →"}
          {phase === "crossing" && "🚶 Crossing the bridge..."}
          {phase === "select-return" &&
            "← Select 1 player to bring the torch back"}
          {phase === "returning" && "🚶 Returning with the torch..."}
        </div>
      )}

      {/* ── Bridge scene ───────────────────────────────────── */}
      <div className="bridge-scene">
        {/* Stars */}
        <div className="stars">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="star"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 40}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        {/* Moon */}
        <div className="moon" />

        {/* Left bank */}
        <div className="bank left-bank">
          <div className="bank-label">
            Left Side {torchSide === "left" && !isAnimating && "🔦"}
          </div>
          <div className="bank-players">
            {leftBank.map((id) => (
              <PlayerToken
                key={id}
                id={id}
                selectable={leftSelectable}
                isSelected={selected.includes(id)}
                onClick={() => toggleSelect(id)}
              />
            ))}
            {leftBank.length === 0 && <div className="empty-bank">Empty</div>}
          </div>
        </div>

        {/* Bridge */}
        <div className="bridge">
          <div className="bridge-planks">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="plank" />
            ))}
          </div>
          <div className="bridge-rope top" />
          <div className="bridge-rope bottom" />

          {/* Water */}
          <div className="water">
            <div className="wave wave1" />
            <div className="wave wave2" />
            <div className="wave wave3" />
          </div>

          {/* Crossing players animation */}
          {crossing.length > 0 && (
            <div className={`crossing-group ${animDir}`}>
              <div className="torch-glow">🔦</div>
              {crossing.map((id) => (
                <div
                  key={id}
                  className="crossing-player"
                  style={{ background: p(id).color }}
                >
                  {p(id).name[0]}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right bank */}
        <div className="bank right-bank">
          <div className="bank-label">
            Right Side {torchSide === "right" && !isAnimating && "🔦"}
          </div>
          <div className="bank-players">
            {rightBank.map((id) => (
              <PlayerToken
                key={id}
                id={id}
                selectable={rightSelectable}
                isSelected={selected.includes(id)}
                onClick={() => toggleSelect(id)}
              />
            ))}
            {rightBank.length === 0 && <div className="empty-bank">Empty</div>}
          </div>
        </div>
      </div>

      {/* ── Action buttons ─────────────────────────────────── */}
      {(phase === "select-pair" || phase === "select-return") && (
        <div className="action-bar">
          <button
            className="btn btn-primary btn-action"
            disabled={
              (phase === "select-pair" && selected.length !== 2) ||
              (phase === "select-return" && selected.length !== 1)
            }
            onClick={phase === "select-pair" ? confirmCross : confirmReturn}
          >
            {phase === "select-pair"
              ? `Cross Bridge (${selected.length}/2 selected)`
              : `Return with Torch (${selected.length}/1 selected)`}
          </button>
        </div>
      )}

      {/* ── Move log ───────────────────────────────────────── */}
      <div className="move-log">
        <h3>📋 Move Log</h3>
        {moveLog.length === 0 && <p className="log-empty">No moves yet</p>}
        <div className="log-entries">
          {moveLog.map((m, i) => (
            <div key={i} className={`log-entry ${m.type}`}>
              <span className="log-icon">{m.type === "cross" ? "→" : "←"}</span>
              <span className="log-text">
                {m.names.join(" & ")}{" "}
                {m.type === "cross" ? "crossed" : "returned"}
              </span>
              <span className="log-cost">+{m.cost}m</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Done overlay ───────────────────────────────────── */}
      {phase === "done" && (
        <div className="done-overlay">
          <div className="done-card">
            <h2>✅ Everyone Crossed!</h2>
            <div className="done-stats">
              <div className="stat">
                <span className="stat-label">Your time</span>
                <span className="stat-value">{elapsed} min</span>
              </div>
              <div className="stat">
                <span className="stat-label">Optimal</span>
                <span className="stat-value">{optimalTime.current} min</span>
              </div>
            </div>
            <p className="done-rating">
              {resultRating().emoji} {resultRating().text}
            </p>
            <button className="btn btn-primary" onClick={onRestart}>
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
