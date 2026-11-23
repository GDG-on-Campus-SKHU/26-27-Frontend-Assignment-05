import { useState, useRef } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useLocation, useNavigate } from "react-router";
import styled from "styled-components";
import { loginApi } from "../api/auth";
import { useAuthStore } from "../store/useAuthStore";
import {
  Card,
  Title,
  Subtitle,
  Form,
  Field,
  Label,
  Input,
  CheckboxLabel,
  SubmitButton,
  ErrorMessage,
  BottomText,
  BottomLink,
} from "../styles/formStyles";

const SAVED_USER_ID_KEY = "saved-user-id";

const LoginCard = styled(Card)`
  max-width: 460px;
  margin: 0 auto;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const LeftIcon = styled.span`
  position: absolute;
  left: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  pointer-events: none;
`;

const IconInput = styled(Input)<{ $hasRightIcon?: boolean }>`
  width: 100%;
  padding-left: 42px;
  padding-right: ${({ $hasRightIcon }) => ($hasRightIcon ? "42px" : "14px")};
`;

const EyeButton = styled.button`
  position: absolute;
  right: 10px;
  padding: 4px;
  border: none;
  background: transparent;
  color: #94a3b8;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 6px;
  transition: color 0.15s ease, background-color 0.15s ease;

  &:hover {
    color: #475569;
    background-color: #f1f5f9;
  }
`;

interface LoginFormState {
  userId: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  // 아이디와 비밀번호를 객체 상태 하나로 관리 (저장된 아이디가 있으면 초기값으로 사용)
  const [form, setForm] = useState<LoginFormState>(() => {
    const savedId = localStorage.getItem(SAVED_USER_ID_KEY) ?? "";
    return {
      userId: savedId,
      password: "",
    };
  });

  // 아이디 저장 체크박스 상태 (localStorage 기반)
  const [saveUserId, setSaveUserId] = useState<boolean>(() => {
    return localStorage.getItem(SAVED_USER_ID_KEY) !== null;
  });

  // 비밀번호 보기/숨기기 상태
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // 아이디·비밀번호 공통 이벤트 핸들러
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // 가짜 API 대신 실제 백엔드 서버(POST /auth/login)로 로그인 요청
      const { user, accessToken } = await loginApi(
        form.userId,
        form.password,
      );

      // 아이디 저장 체크 여부에 따라 localStorage 저장 또는 삭제
      if (saveUserId) {
        localStorage.setItem(SAVED_USER_ID_KEY, form.userId);
      } else {
        localStorage.removeItem(SAVED_USER_ID_KEY);
      }

      const fromState = (
        location.state as { from?: string | { pathname?: string } } | null
      )?.from;
      const redirectTo =
        typeof fromState === "string"
          ? fromState
          : fromState?.pathname || "/todos/all";

      login(user, accessToken);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "로그인에 실패했습니다.";
      setError(message);
      setForm((prev) => ({ ...prev, password: "" }));
      passwordInputRef.current?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const canSubmit = !isLoading;

  return (
    <LoginCard>
      <Title>로그인</Title>
      <Subtitle>아이디와 비밀번호를 입력해 로그인해 주세요.</Subtitle>

      <Form onSubmit={handleSubmit}>
        <Field>
          <Label htmlFor="userId">아이디</Label>
          <InputWrapper>
            <LeftIcon aria-hidden="true">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </LeftIcon>
            {/* 서버의 400/401 오류 문구를 그대로 표시하기 위해 HTML5 required 검증은 제거 */}
            <IconInput
              id="userId"
              type="text"
              name="userId"
              value={form.userId}
              onChange={handleChange}
              placeholder="아이디를 입력하세요"
            />
          </InputWrapper>
        </Field>

        <Field>
          <Label htmlFor="password">비밀번호</Label>
          <InputWrapper>
            <LeftIcon aria-hidden="true">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </LeftIcon>
            <IconInput
              ref={passwordInputRef}
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
              $hasRightIcon
            />
            <EyeButton
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
            >
              {showPassword ? (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </EyeButton>
          </InputWrapper>
        </Field>

        <CheckboxLabel>
          <input
            type="checkbox"
            checked={saveUserId}
            onChange={(e) => setSaveUserId(e.target.checked)}
          />
          아이디 저장
        </CheckboxLabel>

        <SubmitButton type="submit" disabled={!canSubmit} $active={canSubmit}>
          {isLoading ? "로그인 중..." : "로그인"}
        </SubmitButton>
      </Form>

      {error && <ErrorMessage role="alert">{error}</ErrorMessage>}

      <BottomText>
        아직 계정이 없으신가요?
        <BottomLink to="/signup">회원가입</BottomLink>
      </BottomText>
    </LoginCard>
  );
}
