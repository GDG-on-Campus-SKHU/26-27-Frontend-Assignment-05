// 백엔드 API는 { id, text, done }만 저장하므로,
// 3주차에서 추가한 마감일(dueDate) 메타데이터만 "사용자ID:할일ID" 키로 별도 보관하는 유틸
const DUE_DATES_STORAGE_KEY = "todo-due-dates";

export type DueDateMap = Record<string, string>;

// 계정 간 할 일 ID가 겹치지 않도록 사용자 ID와 할 일 ID를 조합한 키 생성
export function makeDueDateKey(userId: number, todoId: number): string {
  return `${userId}:${todoId}`;
}

// 저장된 마감일 맵 불러오기 (손상된 JSON이더라도 안전하게 빈 객체 반환)
export function loadDueDates(): DueDateMap {
  try {
    const raw = localStorage.getItem(DUE_DATES_STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return {};
    }
    const result: DueDateMap = {};
    for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof value === "string") {
        result[key] = value;
      }
    }
    return result;
  } catch {
    return {};
  }
}

// 변경된 마감일 맵 저장
export function saveDueDates(dueDates: DueDateMap): void {
  try {
    localStorage.setItem(DUE_DATES_STORAGE_KEY, JSON.stringify(dueDates));
  } catch {
    // 저장소 용량 초과 등 예외는 무시한다
  }
}
