"use server";

import TaskCreationRequest from "@/types/request/api/tasks/TaskCreationRequest";
import { TaskCreationResponseRoot } from "@/types/response/api/tasks/TaskCreationResponse";

export async function post({
  body,
}: {
  body: TaskCreationRequest;
}): Promise<TaskCreationResponseRoot> {
  const response = await fetch(process.env.API_URL + "/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return response.json();
}

export async function get(taskId: string): Promise<object> {
  const response = await fetch(process.env.API_URL + `/api/result/${taskId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
}

export async function getAsType<T>(taskId: string): Promise<T> {
  return (await get(taskId)) as T;
}
