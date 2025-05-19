import { Feedback } from "@/types/homeScreen";
import {
  generateChoices,
  getRandomInt,
  INITIAL_OPERAND_MAX,
  MAX_OPERAND_MAX,
  OPERATORS,
} from "@/utils";

export type QuestionSlice = {
  operand1: number;
  operand2: number;
  operator: "+" | "-";
  correct: number;
  choices: number[];
  selected: number | null;
  feedback: Feedback;
  newQuestion: () => void;
  onSelect: (choice: number) => void;
  setOperator: (op: "+" | "-") => void;
};

export const createQuestionSlice = (set: any, get: any): QuestionSlice => ({
  operand1: 0,
  operand2: 0,
  operator: "+",
  correct: 0,
  choices: [],
  selected: null,
  feedback: null,

  newQuestion: () => {
    const { level } = get().stats;
    const scaledMax = INITIAL_OPERAND_MAX * level;
    const operandMax = Math.min(scaledMax, MAX_OPERAND_MAX);
    const op = get().operator || OPERATORS[getRandomInt(OPERATORS.length - 1)];
    const a = getRandomInt(operandMax);
    const b = getRandomInt(operandMax);
    const answer = op === "+" ? a + b : a - b;

    set({
      operand1: a,
      operand2: b,
      operator: op,
      correct: answer,
      choices: generateChoices(answer, a, b, op),
      selected: null,
      feedback: null,
    });
  },

  onSelect: (choice: number) => {
    const { correct, stats, operand1, operand2, operator } = get();
    const strictMode = get().strictMode;

    // helper to fire the next question
    const next = () => {
      if (strictMode) {
        get().newQuestion(); // instant
      } else {
        setTimeout(get().newQuestion, 500); // 100ms delay
      }
    };

    // 1) record the answer
    get().incrementQuestions();
    const isCorrect = choice === correct;
    set({ selected: choice, feedback: isCorrect ? "correct" : "wrong" });

    if (isCorrect) {
      // correct‐answer logic
      get().incrementCorrect();
      if (stats.corrected + 1 >= 10) {
        get().incrementLevel();
        get().resetStats();
        get().recordLevelUp();
      }
      // next question
      next();
    } else {
      // wrong‐answer logic
      get().incrementWrong({
        operand1,
        operand2,
        operator,
        correct,
        selected: choice,
        timestamp: Date.now(),
      });

      // if strictMode & this is the 3rd wrong → reset session
      if (strictMode && stats.failed + 1 >= 3) {
        get().resetStats();
        set((s: any) => ({
          stats: {
            ...s.stats,
            level: 1,
          },
        }));
      }
      // next question (instant in strict, 100ms otherwise)
      next();
    }
  },

  setOperator: (op: "+" | "-") => set({ operator: op }),
});
