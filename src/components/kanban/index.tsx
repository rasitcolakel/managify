import React from "react";
import Board from "./components/Board";
import { KanbanProvider } from "@contexts/KanbanContext";
import { Task } from "src/types";

type Props = {
  type: "my" | "team";
  data: readonly Task[];
};

export default function Kanban({ data }: Props) {
  return (
    // @ts-ignore
    <KanbanProvider data={data}>
      <Board />
    </KanbanProvider>
  );
}
