import { DndContext, rectIntersection } from "@dnd-kit/core";
import Lane from "./Lane";
import { useContext } from "react";
import { Grid } from "@mui/material";
import { KanbanContext } from "@contexts/KanbanContext";
import { useTranslate } from "@refinedev/core";

export default function Board() {
  const { todoItems, doneItems, in_progressItems, moveTask } =
    useContext(KanbanContext);

  const t = useTranslate();

  return (
    <DndContext
      collisionDetection={rectIntersection}
      onDragEnd={(e) => {
        const container = e.over?.id as "todo" | "in_progress" | "done";
        const { parent, index, item } = e.active.data.current as {
          parent: string;
          index: number;
          item: any;
        };

        if (!container) return;

        if (container === parent) return;
        moveTask(parent, container, item, index);
      }}
    >
      <Grid
        style={{
          height: "100%",
        }}
        container
        spacing={5}
      >
        <Grid item xs={4}>
          <Lane
            id="todo"
            title={t("tasks.taskStatuses.todo")}
            items={todoItems}
          />
        </Grid>
        <Grid item xs={4}>
          <Lane
            id="in_progress"
            title={t("tasks.taskStatuses.in_progress")}
            items={in_progressItems}
          />
        </Grid>
        <Grid item xs={4}>
          <Lane
            id="done"
            title={t("tasks.taskStatuses.done")}
            items={doneItems}
          />
        </Grid>
      </Grid>
    </DndContext>
  );
}
