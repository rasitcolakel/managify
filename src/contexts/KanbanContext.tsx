import React, { useCallback, useEffect, useReducer } from "react";
import { updateTaskStatus } from "src/services/tasks";
import { Task as ITask } from "src/types";

type Task = ITask & {
  status: "todo" | "done" | "in_progress" | string;
};

interface KanbanState {
  todoItems: Task[];
  doneItems: Task[];
  in_progressItems: Task[];
}

interface SetTasksByStatusAction {
  type: "SET_TASKS_BY_STATUS";
  payload: {
    status: Task["status"];
    tasks: Task[];
  };
}

interface RemoveTaskAction {
  type: "REMOVE_TASK";
  payload: {
    status: Task["status"];
    id: Task["id"];
  };
}

interface MoveTaskAction {
  type: "MOVE_TASK";
  payload: {
    oldBoard: Task["status"];
    newBoard: Task["status"];
    task: Task;
    index: number;
  };
}

type KanbanAction =
  //   | SetTodoItemsAction
  //   | SetDoneItemsAction
  //   | SetInProgressItemsAction
  SetTasksByStatusAction | RemoveTaskAction | MoveTaskAction;

interface KanbanContextProps extends KanbanState {
  //   setTodoItems: (_todoItems: Task) => void;
  //   setDoneItems: (_doneItems: Task) => void;
  //   setInProgressItems: (_in_progressItems: Task) => void;
  setTasksByStatus: (_status: Task["status"], _tasks: Task[]) => void;
  removeTask: (_status: Task["status"], _id: Task["id"]) => void;
  moveTask: (
    _old: Task["status"],
    _new: Task["status"],
    _task: Task,
    _index: number
  ) => void;
}

const initialState: KanbanState = {
  todoItems: [],
  doneItems: [],
  in_progressItems: [],
};

const reducer = (state: KanbanState, action: KanbanAction): KanbanState => {
  switch (action.type) {
    case "SET_TASKS_BY_STATUS":
      const { status, tasks } = action.payload;
      if (status === "in_progress") {
        return {
          ...state,
          in_progressItems: tasks,
        };
      }
      return {
        ...state,
        [`${status}Items`]: tasks,
      };

    case "MOVE_TASK":
      const { oldBoard, newBoard, task, index } = action.payload;

      const oldPosition = `${oldBoard}Items` as keyof KanbanState;
      const newPosition = `${newBoard}Items` as keyof KanbanState;

      if (oldPosition === newPosition) return state;
      return {
        ...state,
        [oldPosition]: [
          ...state[oldPosition].slice(0, index),
          ...state[oldPosition].slice(index + 1),
        ],
        [newPosition]: [...state[newPosition], task],
      };

    case "REMOVE_TASK":
      const { status: removeStatus, id } = action.payload;

      if (removeStatus === "in_progress") {
        return {
          ...state,
          in_progressItems: state.in_progressItems.filter(
            (task) => task.id !== id
          ),
        };
      } else if (removeStatus === "done") {
        return {
          ...state,
          doneItems: state.doneItems.filter((task) => task.id !== id),
        };
      } else {
        return {
          ...state,
          todoItems: state.todoItems.filter((task) => task.id !== id),
        };
      }

    default:
      return state;
  }
};

export const KanbanContext = React.createContext<KanbanContextProps>({
  todoItems: [],
  doneItems: [],
  in_progressItems: [],
  setTasksByStatus: () => {},
  removeTask: () => {},
  moveTask: () => {},
});

interface Props {
  children: React.ReactNode;
  data: Task[];
}

export const KanbanProvider: React.FC<Props> = ({ data, children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setTasksByStatus = useCallback(
    (status: Task["status"], tasks: Task[]) =>
      dispatch({ type: "SET_TASKS_BY_STATUS", payload: { status, tasks } }),
    [dispatch]
  );

  const setInitialTasks = useCallback(() => {
    setTasksByStatus(
      "todo",
      data.filter((task) => task.status === "todo")
    );

    setTasksByStatus(
      "done",
      data.filter((task) => task.status === "done")
    );

    setTasksByStatus(
      "in_progress",
      data.filter((task) => task.status === "in_progress")
    );
  }, [data, setTasksByStatus]);

  const removeTask = (status: Task["status"], id: Task["id"]) =>
    dispatch({ type: "REMOVE_TASK", payload: { status, id } });

  const moveTask = async (
    oldBoard: Task["status"],
    newBoard: Task["status"],
    task: Task,
    index: number
  ) => {
    dispatch({
      type: "MOVE_TASK",
      payload: { oldBoard, newBoard, task, index },
    });
    const update = await updateTaskStatus(task.id, task.team_id, newBoard);
    if (!update) {
      dispatch({
        type: "MOVE_TASK",
        payload: { oldBoard: newBoard, newBoard: oldBoard, task, index },
      });
    }
  };

  useEffect(() => {
    if (!data) return;
    setInitialTasks();
  }, [data, setInitialTasks]);

  return (
    <KanbanContext.Provider
      value={{
        ...state,
        setTasksByStatus,
        removeTask,
        moveTask,
      }}
    >
      {children}
    </KanbanContext.Provider>
  );
};
