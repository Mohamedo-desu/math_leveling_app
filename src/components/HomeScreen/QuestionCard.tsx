import { useAppStore } from "@/store/useAppStore";
import React, { memo, useEffect } from "react";
import ChoicesGrid from "./ChoicesGrid";
import QuestionRow from "./QuestionRow";

const QuestionCard = () => {
  const newQuestion = useAppStore((s) => s.newQuestion);

  useEffect(() => {
    newQuestion();
  }, [newQuestion]);

  return (
    <>
      <QuestionRow />
      <ChoicesGrid />
    </>
  );
};

export default memo(QuestionCard);
