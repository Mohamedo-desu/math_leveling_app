export const OPERATORS = ["+", "-"];
export const INITIAL_OPERAND_MAX = 10;
export const MAX_OPERAND_MAX = 999;
export const CHOICE_COUNT = 4;
export const STREAK_KEY = "streakCount";
export const STREAK_TIME_KEY = "streakTimestamp";

export function generateChoices(
  correct: number,
  op1: number,
  op2: number,
  operator: "+" | "-"
): number[] {
  const choices = new Set<number>([correct]);
  while (choices.size < CHOICE_COUNT) {
    let wrong: number;
    const rand = Math.random();
    if (rand < 0.3) {
      const offset = getRandomInt(5) + 1;
      wrong = correct + (Math.random() < 0.5 ? offset : -offset);
    } else if (operator === "-" && rand < 0.6) {
      wrong = op2 - op1;
    } else {
      wrong = Math.max(0, correct + (getRandomInt(21) - 10));
    }
    if (wrong !== correct) choices.add(wrong);
  }
  return Array.from(choices).sort(() => Math.random() - 0.5);
}

export function getRandomInt(max: number): number {
  return Math.floor(Math.random() * (max + 1));
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
