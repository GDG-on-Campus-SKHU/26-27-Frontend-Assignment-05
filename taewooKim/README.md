# 오늘의 할 일

3번째 과제의 Todo 앱에 로그인, 마이페이지, 사용자별 할 일 저장을 추가했습니다.

## 실행

이 폴더에서 실행합니다. Node.js 24에서 확인했습니다.

```bash
npm ci
npm run dev
```

터미널에 표시되는 주소로 접속하면 됩니다.

테스트 계정: `test1234` / `password1234`

```bash
npm run build
npm run lint
```

## 구현

- React Router 레이아웃 라우트로 로그인 사용자 / 비로그인 사용자 접근 구분
- Zustand `persist`로 로그인 정보 저장 (`auth-storage`)
- 로그인 아이디 저장 (`saved-user-id`), 로그인 실패 안내와 포커스 이동
- 회원가입 후 자동 로그인, 마이페이지에서 관심 분야 변경
- Todo Context로 목록과 추가·수정·완료·삭제·정렬 함수 공유
- 사용자별 할 일 저장 (`todos-사용자id`), 저장된 데이터 형식 검사
- 기존 URL 필터, 입력 폼, 개수, 빈 목록, 축하 문구 유지
- styled-components로 스타일 작성, 로그인·회원가입 공통 스타일 분리
- 비밀번호 보기, 수정 중 Esc 취소, 로그인 후 원래 마이페이지로 복귀
- 카드 형태의 공통 화면, 주·보조 버튼 구분, 전체·완료 개수로 계산한 완료율 표시

## 주요 파일

| 파일 | 역할 |
| --- | --- |
| `src/App.tsx` | 페이지와 레이아웃 라우트 구성 |
| `src/layouts/ProtectedLayout.tsx` | 로그인이 필요한 페이지 보호 |
| `src/layouts/GuestLayout.tsx` | 비로그인 전용 페이지와 로그인 후 이동 |
| `src/layouts/TodosLayout.tsx` | 할 일 경로에만 Provider 적용 |
| `src/stores/useAuthStore.ts` | 로그인 정보 저장·삭제, 관심 분야 변경 |
| `src/contexts/TodoProvider.tsx` | 할 일 목록과 변경 함수, localStorage 저장 |
| `src/hooks/useTodos.ts` | Context 접근과 Provider 누락 검사 |
| `src/utils/todoStorage.ts` | 저장된 목록 불러오기와 타입 검사 |
| `src/styles/FormStyles.ts` | 로그인·회원가입 공통 스타일 |

## 가짜 API 안내

`src/api/auth.ts`와 `src/types/user.ts`는 과제 제공 코드를 그대로 사용합니다.
회원 목록은 메모리에만 있으므로 새로고침하면 새로 가입한 계정은 사라집니다.
로그인 정보와 할 일 목록은 localStorage에 남지만, 새 계정으로 로그아웃한 뒤 다시 로그인하려면 같은 실행 중에 만든 계정이어야 합니다.
새로고침 후 로그인 시험은 항상 존재하는 테스트 계정으로 할 수 있습니다.

비밀번호는 폼 입력과 가짜 API의 메모리에서만 사용하고 브라우저 저장소에는 저장하지 않습니다.
