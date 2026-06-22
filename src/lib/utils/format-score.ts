export function formatScore(score: number): string {
  if (score > 0) return `+${score}`;
  return `${score}`;
}

export function formatScoreAbsolute(score: number): string {
  return `${score > 0 ? "+" : ""}${score}`;
}
