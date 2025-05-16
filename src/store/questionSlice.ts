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
    const op = OPERATORS[getRandomInt(OPERATORS.length - 1)] as "+" | "-";
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
    get().incrementQuestions();
  },
  onSelect: (choice: number) => {
    const { correct, stats, operand1, operand2, operator } = get();
    const isCorrect = choice === correct;
    set({ selected: choice, feedback: isCorrect ? "correct" : "wrong" });
    if (isCorrect) {
      get().incrementCorrect();
      if (stats.corrected + 1 >= 10) {
        get().incrementLevel();
        get().resetStats();
        get().recordLevelUp();
      }
    } else {
      get().incrementWrong({
        operand1,
        operand2,
        operator,
        correct,
        selected: choice,
        timestamp: Date.now(),
      });
    }
    setTimeout(get().newQuestion, 300);
  },
});
