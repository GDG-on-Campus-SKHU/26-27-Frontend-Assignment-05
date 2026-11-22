// =============================================================
// 과제용 Todo 인증 API 서버
// 실행: npm install -> npx nodemon index.js
// 주소: http://localhost:3000
//
// - 데이터는 같은 폴더의 db.json 파일에 저장한다.
//   서버를 다시 시작해도 회원과 할 일이 그대로 남는다.
//   처음 상태로 되돌리고 싶으면 서버를 끄고 db.json 파일을 지운 뒤 다시 실행한다.
// - 학습용 서버라 비밀번호를 그대로 저장하고, 토큰도 단순한 문자열을 쓴다.
//   실제 서비스에서는 비밀번호를 암호화하고, 위조할 수 없는 토큰(JWT 등)을 쓴다.
// =============================================================

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, "db.json");

// 모든 API 응답을 늦추는 시간(ms). 로딩 화면을 확인하려면 값을 키운다(예: 2000).
const DELAY_MS = 500;

app.use(cors());
app.use(express.json());

// 데이터 저장소 (db.json)
const initialData = {
  users: [
    { id: 1, userId: "test1234", password: "password1234", track: "frontend" },
    { id: 2, userId: "test5678", password: "password5678", track: "backend" },
  ],
  todos: [
    { id: 1, ownerId: 1, text: "리액트 복습하기", done: true },
    { id: 2, ownerId: 1, text: "Axios 과제 하기", done: false },
    { id: 3, ownerId: 1, text: "타입스크립트 정리하기", done: false },
    { id: 4, ownerId: 2, text: "Express 서버 공부하기", done: false },
    { id: 5, ownerId: 2, text: "DB 설계 연습하기", done: false },
  ],
};

function loadDb() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
  } catch {
    // 파일이 없거나 깨졌으면 초기 데이터로 시작한다
    const data = structuredClone(initialData);
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    return data;
  }
}

const db = loadDb();

function saveDb() {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// 도우미 함수
const TRACKS = ["frontend", "backend"];

// 응답에는 비밀번호를 빼고 보낸다
function toPublicUser(user) {
  return { id: user.id, userId: user.userId, track: user.track };
}

// 응답에는 ownerId를 빼고 보낸다
function toPublicTodo(todo) {
  return { id: todo.id, text: todo.text, done: todo.done };
}

function createToken(user) {
  return `fake-token-${user.id}`;
}

function toAuthResponse(user) {
  return { user: toPublicUser(user), accessToken: createToken(user) };
}

function isValidText(value) {
  return typeof value === "string" && value.trim() !== "";
}

// 응답 지연 미들웨어 (기본 경로 / 는 제외)
app.use((req, res, next) => {
  if (req.path === "/" || DELAY_MS <= 0) return next();
  setTimeout(next, DELAY_MS);
});

// 로그인이 필요한 API 앞에 붙이는 미들웨어
// 요청 헤더의 Authorization: Bearer <토큰> 을 확인해 req.user에 사용자를 넣는다
function requireAuth(req, res, next) {
  const header = req.headers.authorization ?? "";
  const [type, token] = header.split(" ");
  if (type !== "Bearer" || !token) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }
  const id = Number(token.replace("fake-token-", ""));
  const user = db.users.find((u) => u.id === id);
  if (!user) {
    return res
      .status(401)
      .json({ message: "로그인 정보가 만료되었습니다. 다시 로그인해 주세요." });
  }
  req.user = user;
  next();
}

// 기본 경로
app.get("/", (req, res) => {
  res.send("Welcome to the Todo Auth API Service!");
});

// 인증 API

// 아이디 중복 확인: GET /auth/check-id?userId=abcd → { available: true | false }
app.get("/auth/check-id", (req, res) => {
  const userId = String(req.query.userId ?? "");
  if (!/^[A-Za-z0-9]{4,12}$/.test(userId)) {
    return res
      .status(400)
      .json({ message: "아이디는 4~12자의 영문과 숫자만 사용할 수 있습니다." });
  }
  const available = !db.users.some((u) => u.userId === userId);
  res.json({ available });
});

// 회원가입: POST /auth/signup  { userId, password, track } → 201 { user, accessToken }
app.post("/auth/signup", (req, res) => {
  const { userId, password, track } = req.body ?? {};
  if (typeof userId !== "string" || !/^[A-Za-z0-9]{4,12}$/.test(userId)) {
    return res
      .status(400)
      .json({ message: "아이디는 4~12자의 영문과 숫자만 사용할 수 있습니다." });
  }
  if (typeof password !== "string" || password.length < 8) {
    return res
      .status(400)
      .json({ message: "비밀번호는 8자 이상이어야 합니다." });
  }
  if (!TRACKS.includes(track)) {
    return res
      .status(400)
      .json({ message: "관심 분야를 올바르게 선택해 주세요." });
  }
  if (db.users.some((u) => u.userId === userId)) {
    return res.status(409).json({ message: "이미 사용 중인 아이디입니다." });
  }
  const user = { id: Date.now(), userId, password, track };
  db.users.push(user);
  saveDb();
  res.status(201).json(toAuthResponse(user));
});

// 로그인: POST /auth/login  { userId, password } → { user, accessToken }
app.post("/auth/login", (req, res) => {
  const { userId, password } = req.body ?? {};
  const user = db.users.find(
    (u) => u.userId === userId && u.password === password,
  );
  if (!user) {
    return res
      .status(401)
      .json({ message: "아이디 또는 비밀번호가 올바르지 않습니다." });
  }
  res.json(toAuthResponse(user));
});

// 사용자 API (로그인 필요)

// 내 정보 조회: GET /users/me → user
app.get("/users/me", requireAuth, (req, res) => {
  res.json(toPublicUser(req.user));
});

// 관심 분야 변경: PATCH /users/me  { track } → user
app.patch("/users/me", requireAuth, (req, res) => {
  const { track } = req.body ?? {};
  if (!TRACKS.includes(track)) {
    return res
      .status(400)
      .json({ message: "관심 분야를 올바르게 선택해 주세요." });
  }
  req.user.track = track;
  saveDb();
  res.json(toPublicUser(req.user));
});

// 할 일 API (로그인 필요, 로그인한 사용자의 할 일만 다룬다)

function findMyTodo(req, res) {
  const id = Number(req.params.id);
  const todo = db.todos.find((t) => t.id === id && t.ownerId === req.user.id);
  if (!todo) {
    res.status(404).json({ message: "해당 할 일을 찾을 수 없습니다." });
    return null;
  }
  return todo;
}

// 목록 조회: GET /todos → 할 일 배열(등록순)
app.get("/todos", requireAuth, (req, res) => {
  const myTodos = db.todos.filter((t) => t.ownerId === req.user.id);
  res.json(myTodos.map(toPublicTodo));
});

// 추가: POST /todos  { text } → 201 새 할 일
app.post("/todos", requireAuth, (req, res) => {
  const { text } = req.body ?? {};
  if (!isValidText(text)) {
    return res.status(400).json({ message: "할 일 내용을 입력해 주세요." });
  }
  const todo = {
    id: Date.now(),
    ownerId: req.user.id,
    text: text.trim(),
    done: false,
  };
  db.todos.push(todo);
  saveDb();
  res.status(201).json(toPublicTodo(todo));
});

// 완료한 할 일 모두 삭제: DELETE /todos/completed → 204
// (/todos/:id 보다 먼저 선언해야 'completed'가 id로 해석되지 않는다)
app.delete("/todos/completed", requireAuth, (req, res) => {
  db.todos = db.todos.filter((t) => !(t.ownerId === req.user.id && t.done));
  saveDb();
  res.status(204).end();
});

// 완료 상태 반전: PATCH /todos/:id/done → 바뀐 할 일
app.patch("/todos/:id/done", requireAuth, (req, res) => {
  const todo = findMyTodo(req, res);
  if (!todo) return;
  todo.done = !todo.done;
  saveDb();
  res.json(toPublicTodo(todo));
});

// 내용 수정: PUT /todos/:id  { text } → 수정된 할 일
app.put("/todos/:id", requireAuth, (req, res) => {
  const { text } = req.body ?? {};
  if (!isValidText(text)) {
    return res.status(400).json({ message: "할 일 내용을 입력해 주세요." });
  }
  const todo = findMyTodo(req, res);
  if (!todo) return;
  todo.text = text.trim();
  saveDb();
  res.json(toPublicTodo(todo));
});

// 삭제: DELETE /todos/:id → 204
app.delete("/todos/:id", requireAuth, (req, res) => {
  const todo = findMyTodo(req, res);
  if (!todo) return;
  db.todos = db.todos.filter((t) => t.id !== todo.id);
  saveDb();
  res.status(204).end();
});

// 없는 경로
app.use((req, res) => {
  res.status(404).json({ message: "존재하지 않는 API입니다." });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
