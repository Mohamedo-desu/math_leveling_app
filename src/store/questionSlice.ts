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
  /** user preference: "+", "-" or "mix" */
  operator: "+" | "-" | "mix";
  /** actual operator used for current question: "+" or "-" */
  questionOperator: "+" | "-";
  correct: number;
  choices: number[];
  selected: number | null;
  feedback: Feedback;
  newQuestion: () => void;
  onSelect: (choice: number) => void;
  setOperator: (op: "+" | "-" | "mix") => void;
};

export const createQuestionSlice = (set: any, get: any): QuestionSlice => ({
  operand1: 0,
  operand2: 0,
  operator: "mix", // user’s preference (+, -, or mix)
  questionOperator: "+", // actual operator for current Q
  correct: 0,
  choices: [],
  selected: null,
  feedback: null,

  newQuestion: () => {
    // determine max range based on current level
    const { level } = get().stats;
    const scaledMax = INITIAL_OPERAND_MAX * level;
    const operandMax = Math.min(scaledMax, MAX_OPERAND_MAX);

    // pick operator: if mix, randomly from OPERATORS; else use preference
    const prefOp = get().operator as "+" | "-" | "mix";
    const actualOp: "+" | "-" =
      prefOp === "mix"
        ? (OPERATORS[getRandomInt(OPERATORS.length - 1)] as "+" | "-")
        : prefOp;

    // generate operands and compute correct answer
    const a = getRandomInt(operandMax);
    const b = getRandomInt(operandMax);
    const answer = actualOp === "+" ? a + b : a - b;

    // update state for new question
    set({
      operand1: a,
      operand2: b,
      questionOperator: actualOp,
      correct: answer,
      choices: generateChoices(answer, a, b, actualOp),
      selected: null,
      feedback: null,
    });
  },

  onSelect: (choice: number) => {
    const { correct, stats, operand1, operand2, questionOperator } = get();
    const strictMode = get().strictMode;

    // record total questions
    get().incrementQuestions();
    const isCorrect = choice === correct;
    set({ selected: choice, feedback: isCorrect ? "correct" : "wrong" });

    if (isCorrect) {
      // correct: increment and potentially level up
      get().incrementCorrect();
      if (stats.corrected + 1 >= 10) {
        get().incrementLevel();
        get().resetStats();
        get().recordLevelUp();
      }
    } else {
      // wrong: log wrong answer details
      get().incrementWrong({
        operand1,
        operand2,
        operator: questionOperator,
        correct,
        selected: choice,
        timestamp: Date.now(),
      });

      // strict mode: reset on 3 fails
      if (strictMode && stats.failed + 1 >= 3) {
        get().resetStats();
        set((s: any) => ({ stats: { ...s.stats, level: 1 } }));
      }
    }

    // trigger next question (instant in strict, else 500ms)
    if (strictMode) {
      get().newQuestion();
    } else {
      setTimeout(get().newQuestion, 500);
    }
  },

  setOperator: (op: "+" | "-" | "mix") => {
    // update user preference and immediately log
    set({ operator: op });
  },
});
