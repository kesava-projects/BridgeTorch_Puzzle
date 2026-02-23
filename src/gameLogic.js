/**
 * Compute the optimal (minimum) crossing time using the classic algorithm.
 *
 * The two competing strategies per round (removing 2 slowest each time):
 *   A) Use 2nd-fastest to escort the two slowest together
 *   B) Use fastest to escort each of the two slowest individually
 */
export function computeOptimalTime(players) {
  const times = players.map((p) => p.time).sort((a, b) => a - b);
  const n = times.length;

  if (n === 1) return times[0];
  if (n === 2) return times[1];
  if (n === 3) return times[0] + times[1] + times[2];

  let total = 0;
  let remaining = n;

  while (remaining > 3) {
    const a = times[1] + times[0] + times[remaining - 1] + times[1];
    const b = times[remaining - 1] + times[0] + times[remaining - 2] + times[0];
    total += Math.min(a, b);
    remaining -= 2;
  }

  if (remaining === 3) {
    total += times[0] + times[1] + times[2];
  } else {
    total += times[1];
  }

  return total;
}

/** Generate a unique id */
let _id = 0;
export function uid() {
  return `player-${++_id}`;
}

/** Default player colours (cycle if >8 players) */
export const PLAYER_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FECA57', '#FF9FF3', '#54A0FF', '#5F27CD',
  '#01A3A4', '#F368E0',
];
