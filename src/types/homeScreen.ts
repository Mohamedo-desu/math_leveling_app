export type Feedback = "correct" | "wrong" | null;

export type StatsState = {
  corrected: number;
  failed: number;
  questions: number;
  level: number;
};

export type StatsAction =
  | { type: "CORRECT" }
  | { type: "WRONG" }
  | { type: "NEW_QUESTION" }
  | { type: "RESET_STATS" }
  | { type: "INCREMENT_LEVEL" };
