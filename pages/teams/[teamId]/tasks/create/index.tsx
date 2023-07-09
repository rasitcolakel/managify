import { TaskCreate } from "@components/teams/tasks/create";
import React from "react";

type Props = {};

export default function index({}: Props) {
  return (
    <div>
      <TaskCreate />
    </div>
  );
}
