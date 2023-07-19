import { DndContext, rectIntersection } from "@dnd-kit/core";
import Lane from "./Lane";
import { useContext } from "react";
import { Grid, useMediaQuery } from "@mui/material";
import { KanbanContext } from "@contexts/KanbanContext";
import { useTranslate } from "@refinedev/core";

export default function Board() {
  const { todoItems, doneItems, in_progressItems, moveTask } =
    useContext(KanbanContext);
  const isMobile = useMediaQuery("(max-width: 600px)");

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
        spacing={isMobile ? 1 : 3}
      >
        <Grid item xs={12} md={4}>
          <Lane
            id="todo"
            title={t("tasks.taskStatuses.todo")}
            items={todoItems}
            typographyProps={{
              color: "primary.main",
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Lane
            id="in_progress"
            title={t("tasks.taskStatuses.in_progress")}
            items={in_progressItems}
            typographyProps={{
              color: "warning.main",
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Lane
            id="done"
            title={t("tasks.taskStatuses.done")}
            items={doneItems}
            typographyProps={{
              color: "success.main",
            }}
          />
        </Grid>
      </Grid>
    </DndContext>
  );
}
