/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { axiosInstance } from "../api/axiosInstance";
import { useAxios } from "../hooks/useAxios";
import { useAuthStore } from "../store/useAuthStore";
import {
  loadDueDates,
  makeDueDateKey,
  saveDueDates,
} from "../utils/todoDueDates";
import type { DueDateMap } from "../utils/todoDueDates";
import type { Todo } from "../types";

export interface TodoContextValue {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
  isNameAsc: boolean;
  isTimeAsc: boolean;
  addTodo: (text: string, dueDate?: string) => Promise<boolean>;
  toggleTodo: (id: number) => Promise<boolean>;
  editTodo: (id: number, text: string, dueDate?: string) => Promise<boolean>;
  deleteTodo: (id: number) => Promise<boolean>;
  sortByName: () => void;
  sortByTime: () => void;
  clearDone: () => Promise<boolean>;
}

export const TodoContext = createContext<TodoContextValue | null>(null);

interface TodoProviderInnerProps {
  userId: number | null;
  children: ReactNode;
}

function TodoProviderInner({ userId, children }: TodoProviderInnerProps) {
  // 기존 localStorage 기반 조회를 제거하고 useAxios 커스텀 훅으로 서버(GET /todos)에서 불러온다
  const {
    data: serverTodos,
    setData: setServerTodos,
    error,
    isLoading,
  } = useAxios<Todo[]>("/todos", []);

  // 서버 API는 { id, text, done }만 저장하므로 마감일(dueDate) 메타데이터만 별도로 보존한다
  const [dueDates, setDueDates] = useState<DueDateMap>(() => loadDueDates());
  const [isNameAsc, setIsNameAsc] = useState(true);
  const [isTimeAsc, setIsTimeAsc] = useState(true);

  // 마감일 상태와 저장소를 동시에 갱신하는 헬퍼
  const updateDueDates = (updater: (prev: DueDateMap) => DueDateMap) => {
    setDueDates((prev) => {
      const next = updater(prev);
      saveDueDates(next);
      return next;
    });
  };

  // 서버 할 일 목록에 사용자별 저장된 마감일(dueDate)을 병합해 컴포넌트에 제공
  const todos = useMemo<Todo[]>(() => {
    if (userId === null) return serverTodos;
    return serverTodos.map((todo) => {
      const savedDueDate = dueDates[makeDueDateKey(userId, todo.id)];
      return savedDueDate ? { ...todo, dueDate: savedDueDate } : todo;
    });
  }, [serverTodos, dueDates, userId]);

  // 할 일 추가 (POST /todos): 성공 시 다시 GET하지 않고 응답 데이터를 목록 끝에 추가, 성공 여부를 boolean으로 반환
  const addTodo = async (text: string, dueDate?: string): Promise<boolean> => {
    const trimmed = text.trim();
    const normalizedDueDate = dueDate?.trim() ? dueDate.trim() : undefined;

    try {
      const response = await axiosInstance.post<Todo>("/todos", {
        text: trimmed,
      });
      if (userId !== null && normalizedDueDate) {
        const key = makeDueDateKey(userId, response.data.id);
        updateDueDates((prev) => ({ ...prev, [key]: normalizedDueDate }));
      }
      setServerTodos((prev) => [...prev, response.data]);
      return true;
    } catch (e) {
      window.alert(
        e instanceof Error ? e.message : "할 일을 추가하지 못했습니다.",
      );
      return false;
    }
  };

  // 완료 상태 토글 (PATCH /todos/:id/done): 응답으로 받은 할 일로 해당 항목만 교체
  const toggleTodo = async (id: number): Promise<boolean> => {
    try {
      const response = await axiosInstance.patch<Todo>(`/todos/${id}/done`);
      setServerTodos((prev) =>
        prev.map((todo) => (todo.id === id ? response.data : todo)),
      );
      return true;
    } catch (e) {
      window.alert(
        e instanceof Error ? e.message : "완료 상태를 변경하지 못했습니다.",
      );
      return false;
    }
  };

  // 할 일 수정 (PUT /todos/:id): 응답으로 받은 수정본으로 교체하고 마감일 메타데이터도 동기화
  const editTodo = async (
    id: number,
    text: string,
    dueDate?: string,
  ): Promise<boolean> => {
    const trimmed = text.trim();
    const normalizedDueDate = dueDate?.trim() ? dueDate.trim() : undefined;

    try {
      const response = await axiosInstance.put<Todo>(`/todos/${id}`, {
        text: trimmed,
      });
      if (userId !== null) {
        const key = makeDueDateKey(userId, id);
        updateDueDates((prev) => {
          const next = { ...prev };
          if (normalizedDueDate) {
            next[key] = normalizedDueDate;
          } else {
            delete next[key];
          }
          return next;
        });
      }
      setServerTodos((prev) =>
        prev.map((todo) => (todo.id === id ? response.data : todo)),
      );
      return true;
    } catch (e) {
      window.alert(
        e instanceof Error ? e.message : "할 일을 수정하지 못했습니다.",
      );
      return false;
    }
  };

  // 할 일 단건 삭제 (DELETE /todos/:id): 목록과 마감일 메타데이터에서 함께 제거
  const deleteTodo = async (id: number): Promise<boolean> => {
    try {
      await axiosInstance.delete<void>(`/todos/${id}`);
      if (userId !== null) {
        const key = makeDueDateKey(userId, id);
        updateDueDates((prev) => {
          if (!(key in prev)) return prev;
          const next = { ...prev };
          delete next[key];
          return next;
        });
      }
      setServerTodos((prev) => prev.filter((todo) => todo.id !== id));
      return true;
    } catch (e) {
      window.alert(
        e instanceof Error ? e.message : "할 일을 삭제하지 못했습니다.",
      );
      return false;
    }
  };

  // 완료한 할 일 일괄 삭제 (DELETE /todos/completed): 완료 항목과 해당 마감일 메타데이터 제거
  const clearDone = async (): Promise<boolean> => {
    try {
      const doneIds = serverTodos
        .filter((todo) => todo.done)
        .map((todo) => todo.id);
      await axiosInstance.delete<void>("/todos/completed");
      if (userId !== null && doneIds.length > 0) {
        updateDueDates((prev) => {
          const next = { ...prev };
          for (const id of doneIds) {
            delete next[makeDueDateKey(userId, id)];
          }
          return next;
        });
      }
      setServerTodos((prev) => prev.filter((todo) => !todo.done));
      return true;
    } catch (e) {
      window.alert(
        e instanceof Error
          ? e.message
          : "완료한 할 일을 삭제하지 못했습니다.",
      );
      return false;
    }
  };

  // 이름순 정렬: 서버 요청 없이 현재 화면 상태만 정렬
  const sortByName = () => {
    setServerTodos((prev) =>
      [...prev].sort((a, b) =>
        isNameAsc
          ? a.text.localeCompare(b.text, "ko")
          : b.text.localeCompare(a.text, "ko"),
      ),
    );
    setIsNameAsc((prev) => !prev);
  };

  // 남은 시간(마감일)순 정렬: 서버 요청 없이 현재 화면 상태만 정렬
  const sortByTime = () => {
    setServerTodos((prev) =>
      [...prev].sort((a, b) => {
        const dueA =
          userId !== null ? dueDates[makeDueDateKey(userId, a.id)] : a.dueDate;
        const dueB =
          userId !== null ? dueDates[makeDueDateKey(userId, b.id)] : b.dueDate;
        if (dueA === undefined && dueB === undefined) return 0;
        if (dueA === undefined) return 1;
        if (dueB === undefined) return -1;
        return isTimeAsc
          ? dueA.localeCompare(dueB)
          : dueB.localeCompare(dueA);
      }),
    );
    setIsTimeAsc((prev) => !prev);
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        isLoading,
        error,
        isNameAsc,
        isTimeAsc,
        addTodo,
        toggleTodo,
        editTodo,
        deleteTodo,
        sortByName,
        sortByTime,
        clearDone,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export function TodoProvider({ children }: { children: ReactNode }) {
  const user = useAuthStore((state) => state.user);

  return (
    <TodoProviderInner key={user?.id ?? "guest"} userId={user?.id ?? null}>
      {children}
    </TodoProviderInner>
  );
}

export function useTodos(): TodoContextValue {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodos는 TodoProvider 안에서만 사용할 수 있습니다.");
  }
  return context;
}
