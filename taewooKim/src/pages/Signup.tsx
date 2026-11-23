import { useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router';
import { checkIdApi, signupApi } from '../api/auth';
import type { Track } from '../types/user';
import { useAuthStore } from '../stores/useAuthStore';
import {
  Title,
  Form,
  Field,
  Label,
  Input,
  InputRow,
  CheckButton,
  CheckMessage,
  Hint,
  Fieldset,
  OptionLabel,
  SubmitButton,
  ErrorMessage,
  FormLink,
} from '../styles/FormStyles';

interface SignupFormState {
  userId: string;
  password: string;
  passwordConfirm: string;
  track: Track;
  agree: boolean;
  showPassword: boolean;
}

const initialFormState: SignupFormState = {
  userId: '',
  password: '',
  passwordConfirm: '',
  track: 'frontend',
  agree: false,
  showPassword: false,
};

export default function Signup() {
  const [formState, setFormState] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  // null이면 아직 중복 확인을 하지 않은 상태
  const [idCheck, setIdCheck] = useState<{ available: boolean; message: string } | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const userIdRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);
  const login = useAuthStore((state) => state.login);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // 아이디를 고치면 확인 결과를 지운다.
    if (e.target.name === 'userId') setIdCheck(null);
  };

  const handleCheckId = async () => {
    if (isChecking) return;

    setError('');
    setIsChecking(true);
    try {
      const available = await checkIdApi(formState.userId);
      if (available) {
        setIdCheck({ available: true, message: '사용할 수 있는 아이디입니다.' });
      } else {
        setIdCheck({ available: false, message: '이미 사용 중인 아이디입니다.' });
      }
    } catch (err) {
      setIdCheck({
        available: false,
        message: err instanceof Error ? err.message : '아이디를 확인하지 못했습니다.',
      });
    } finally {
      setIsChecking(false);
    }
  };

  // 체크박스는 value가 아니라 checked를 읽는다.
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.checked }));
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting || !formState.agree) return;
    setError('');

    if (!idCheck?.available) {
      setError('아이디 중복 확인을 해 주세요.');
      userIdRef.current?.focus();
      return;
    }

    if (formState.password !== formState.passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      passwordConfirmRef.current?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      const { user, accessToken } = await signupApi(
        formState.userId,
        formState.password,
        formState.track,
      );
      alert(`${user.userId}님, 가입을 환영합니다!`);
      login(user, accessToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : '회원가입에 실패했습니다. 다시 시도해 주세요.');
      userIdRef.current?.focus();
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = formState.agree && !isSubmitting;

  return (
    <section>
      <Title>회원가입</Title>
      <Form onSubmit={submitHandler} aria-busy={isSubmitting}>
        <Field>
          <Label htmlFor="userId">아이디</Label>
          <InputRow>
            <Input
              ref={userIdRef}
              type="text"
              id="userId"
              name="userId"
              autoComplete="username"
              placeholder="영문, 숫자 4~12자"
              value={formState.userId}
              onChange={handleChange}
              readOnly={isChecking}
              required
              minLength={4}
              maxLength={12}
              pattern="[A-Za-z0-9]{4,12}"
              title="4~12자의 영문과 숫자만 사용할 수 있습니다."
            />
            <CheckButton
              type="button"
              onClick={handleCheckId}
              disabled={isChecking || formState.userId === ''}
            >
              {isChecking ? '확인 중...' : '중복 확인'}
            </CheckButton>
          </InputRow>
          {idCheck && (
            <CheckMessage $available={idCheck.available} role="status">
              {idCheck.message}
            </CheckMessage>
          )}
        </Field>

        <Field>
          <Label htmlFor="password">비밀번호</Label>
          <Input
            type={formState.showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            autoComplete="new-password"
            placeholder="8자 이상"
            value={formState.password}
            onChange={handleChange}
            required
            minLength={8}
          />
        </Field>

        <Field>
          <Label htmlFor="passwordConfirm">비밀번호 확인</Label>
          <Input
            ref={passwordConfirmRef}
            type={formState.showPassword ? 'text' : 'password'}
            id="passwordConfirm"
            name="passwordConfirm"
            autoComplete="new-password"
            placeholder="비밀번호를 한 번 더 입력하세요."
            value={formState.passwordConfirm}
            onChange={handleChange}
            required
          />
        </Field>

        <OptionLabel>
          <input
            type="checkbox"
            name="showPassword"
            checked={formState.showPassword}
            onChange={handleCheckboxChange}
          />
          비밀번호 보기
        </OptionLabel>

        <Fieldset>
          <legend>관심 분야</legend>
          <OptionLabel>
            <input
              type="radio"
              name="track"
              value="frontend"
              checked={formState.track === 'frontend'}
              onChange={handleChange}
            />
            프론트엔드
          </OptionLabel>
          <OptionLabel>
            <input
              type="radio"
              name="track"
              value="backend"
              checked={formState.track === 'backend'}
              onChange={handleChange}
            />
            백엔드
          </OptionLabel>
        </Fieldset>

        <Field>
          <OptionLabel htmlFor="agree">
            <input
              type="checkbox"
              id="agree"
              name="agree"
              checked={formState.agree}
              onChange={handleCheckboxChange}
            />
            이용약관에 동의합니다.
          </OptionLabel>
          {!formState.agree && <Hint>약관에 동의해야 가입할 수 있어요.</Hint>}
        </Field>

        <SubmitButton type="submit" $active={canSubmit} disabled={!canSubmit}>
          {isSubmitting ? '가입 중...' : '가입하기'}
        </SubmitButton>
      </Form>
      {error && <ErrorMessage role="alert">{error}</ErrorMessage>}
      <FormLink>
        이미 계정이 있나요? <Link to="/login">로그인</Link>
      </FormLink>
    </section>
  );
}
