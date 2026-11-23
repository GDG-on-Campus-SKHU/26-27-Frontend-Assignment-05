# 오늘의 할 일

4번째 과제의 Todo 앱을 과제 서버와 연결했습니다.

## 실행

터미널이 두 개 필요합니다.

```bash
# 1) 과제 서버 (backend 폴더)
npm install
npx nodemon index.js

# 2) 리액트 앱 (이 폴더)
npm install
npm run dev
```

테스트 계정: `test1234` / `password1234`, `test5678` / `password5678`

## 구현

- 가짜 인증 API를 지우고 Axios로 로그인·회원가입·관심 분야 변경 요청
- `useAxios` 훅으로 할 일 목록 조회 (`data`, `setData`, `error`, `isLoading`)
- 추가·완료·수정·삭제 후 다시 GET 하지 않고 응답으로 목록 수정
- 로딩 → 오류 → 데이터 순서로 화면 표시, 요청 중 버튼 비활성화
- 도전 과제: 홈 할 일 요약, 아이디 중복 확인, 항목별 중복 클릭 방지
