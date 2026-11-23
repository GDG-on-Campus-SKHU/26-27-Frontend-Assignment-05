import { useState, useRef } from "react";
import type { ChangeEvent, ClipboardEvent, FormEvent } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { signupApi, checkUserIdApi } from "../api/auth";
import { useAuthStore } from "../store/useAuthStore";
import type { Track } from "../types/user";
import {
  Card,
  Title,
  Subtitle,
  Form,
  Field,
  Label,
  Input,
  RadioGroup,
  RadioLabel,
  CheckboxLabel,
  SubmitButton,
  ErrorMessage,
  BottomText,
  BottomLink,
} from "../styles/formStyles";

const IdInputRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: stretch;
`;

const IdInput = styled(Input)`
  flex: 1;
  min-width: 0;
`;

const CheckIdButton = styled.button`
  padding: 0 16px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  background-color: #f8fafc;
  color: #334155;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    background-color: #eff6ff;
    border-color: #93c5fd;
    color: #2563eb;
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const IdCheckMessage = styled.p<{ $available: boolean }>`
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: ${({ $available }) => ($available ? "#16a34a" : "#dc2626")};
`;

interface SignupFormState {
  username: string;
  password: string;
  passwordConfirm: string;
  showPassword: boolean;
  interest: Track;
  agreed: boolean;
}

type IdCheckStatus = "idle" | "available" | "unavailable";

export default function Signup() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<SignupFormState>({
    username: "",
    password: "",
    passwordConfirm: "",
    showPassword: false,
    interest: "frontend",
    agreed: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // [도전 과제 2] 아이디 중복 확인 상태 (idle: 미확인, available: 사용 가능, unavailable: 불가)
  const [isCheckingId, setIsCheckingId] = useState(false);
  const [idCheckStatus, setIdCheckStatus] = useState<IdCheckStatus>("idle");
  const [idCheckMessage, setIdCheckMessage] = useState("");

  // 모든 입력 요소 공통 핸들러
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // 아이디를 다시 고치면 중복 확인 결과를 초기화한다
    if (name === "username") {
      setIdCheckStatus("idle");
      setIdCheckMessage("");
    }
  };

  // [도전 과제 2] 아이디 중복 확인 요청 (GET /auth/check-id?userId=...)
  const handleCheckId = async () => {
    setIsCheckingId(true);
    setIdCheckMessage("");
    setError("");

    try {
      const { available } = await checkUserIdApi(form.username);
      if (available) {
        setIdCheckStatus("available");
        setIdCheckMessage("사용할 수 있는 아이디입니다.");
      } else {
        setIdCheckStatus("unavailable");
        setIdCheckMessage("이미 사용 중인 아이디입니다.");
      }
    } catch (err) {
      // 서버가 보낸 400(4자 미만 등) 또는 네트워크 오류 문구를 그대로 표시
      const message =
        err instanceof Error ? err.message : "아이디 중복 확인에 실패했습니다.";
      setIdCheckStatus("unavailable");
      setIdCheckMessage(message);
      usernameRef.current?.focus();
    } finally {
      setIsCheckingId(false);
    }
  };

  // 비밀번호 확인 칸 붙여넣기 방지
  const handleBlockPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
  };

  // 회원가입 제출 처리
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // [도전 과제 2] 사용 가능한 아이디로 중복 확인을 통과하지 않은 경우 제출 차단
    if (idCheckStatus !== "available") {
      setError("아이디 중복 확인을 해 주세요.");
      usernameRef.current?.focus();
      return;
    }

    if (form.password !== form.passwordConfirm) {
      window.alert("비밀번호가 일치하지 않습니다.");
      passwordConfirmRef.current?.focus();
      return;
    }

    setIsLoading(true);
    try {
      // 가짜 API 대신 실제 백엔드 서버(POST /auth/signup)로 회원가입 요청
      const { user, accessToken } = await signupApi(
        form.username,
        form.password,
        form.interest,
      );

      window.alert(`${user.userId}님, 가입을 환영합니다!`);
      login(user, accessToken);
      navigate("/todos/all", { replace: true });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "회원가입에 실패했습니다.";
      setError(message);
      usernameRef.current?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const canSubmit = form.agreed && !isLoading;

  return (
    <Card>
      <Title>회원가입</Title>
      <Subtitle>서비스 이용을 위해 회원 정보를 입력해 주세요.</Subtitle>

      <Form onSubmit={handleSubmit}>
        {/* 아이디 + 중복 확인 */}
        <Field>
          <Label htmlFor="username">아이디</Label>
          <IdInputRow>
            <IdInput
              ref={usernameRef}
              id="username"
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="4~12자 영문, 숫자"
            />
            <CheckIdButton
              type="button"
              onClick={handleCheckId}
              disabled={isCheckingId || isLoading}
            >
              {isCheckingId ? "확인 중..." : "중복 확인"}
            </CheckIdButton>
          </IdInputRow>
          {idCheckMessage && (
            <IdCheckMessage
              $available={idCheckStatus === "available"}
              role="status"
            >
              {idCheckMessage}
            </IdCheckMessage>
          )}
        </Field>

        {/* 비밀번호 */}
        <Field>
          <Label htmlFor="password">비밀번호</Label>
          <Input
            id="password"
            type={form.showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="8자 이상 입력"
          />
        </Field>

        {/* 비밀번호 확인 */}
        <Field>
          <Label htmlFor="passwordConfirm">비밀번호 확인</Label>
          <Input
            ref={passwordConfirmRef}
            id="passwordConfirm"
            type={form.showPassword ? "text" : "password"}
            name="passwordConfirm"
            value={form.passwordConfirm}
            onChange={handleChange}
            onPaste={handleBlockPaste}
            placeholder="비밀번호 재입력"
          />
        </Field>

        {/* 비밀번호 보기 체크박스 */}
        <CheckboxLabel>
          <input
            type="checkbox"
            name="showPassword"
            checked={form.showPassword}
            onChange={handleChange}
          />
          비밀번호 보기
        </CheckboxLabel>

        {/* 관심 분야 */}
        <Field>
          <Label as="span">관심 분야</Label>
          <RadioGroup>
            <RadioLabel>
              <input
                type="radio"
                name="interest"
                value="frontend"
                checked={form.interest === "frontend"}
                onChange={handleChange}
              />
              프론트엔드
            </RadioLabel>
            <RadioLabel>
              <input
                type="radio"
                name="interest"
                value="backend"
                checked={form.interest === "backend"}
                onChange={handleChange}
              />
              백엔드
            </RadioLabel>
          </RadioGroup>
        </Field>

        {/* 약관 동의 */}
        <CheckboxLabel>
          <input
            type="checkbox"
            name="agreed"
            checked={form.agreed}
            onChange={handleChange}
          />
          이용약관에 동의합니다.
        </CheckboxLabel>

        <SubmitButton type="submit" disabled={!canSubmit} $active={canSubmit}>
          {isLoading ? "가입 중..." : "가입하기"}
        </SubmitButton>
      </Form>

      {error && <ErrorMessage role="alert">{error}</ErrorMessage>}

      <BottomText>
        이미 계정이 있으신가요?
        <BottomLink to="/login">로그인</BottomLink>
      </BottomText>
    </Card>
  );
}
