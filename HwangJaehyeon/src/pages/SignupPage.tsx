import { useRef, useState } from 'react';
import type { ChangeEvent, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router';
import { signupApi } from '../api/auth'; // API 사용을 위해 변경
import { useAuthStore } from '../stores/useAuthStore';
import { Form, Field, Interests, SubmitButton, ErrorMessage } from '../components/formStyles';
import { Link } from 'react-router';
import { Card, TextInput } from '../components/ui';
import type { SignupValues } from '../types';

export default function SignupPage() {
  const [values, setValues] = useState<SignupValues>({
    username: '',
    password: '',
    passwordConfirm: '',
    interest: 'frontend',
    agreed: false,
  });
  const login = useAuthStore((state) => state.login);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const userInput = useRef<HTMLInputElement>(null);
  const confirmInput = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.currentTarget;
    name === 'username' && event.currentTarget.setCustomValidity('');
    setValues((previous) => ({ ...previous, [name]: value }));
  }

  function handleAgreementChange(event: ChangeEvent<HTMLInputElement>) {
    const agreed = event.currentTarget.checked;
    setValues((previous) => ({ ...previous, agreed }));
  }

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!values.agreed || pending) return;

    if (values.password !== values.passwordConfirm) {
      window.alert('비밀번호가 일치하지 않습니다.');
      confirmInput.current?.focus();
      return;
    }

    setPending(true);
    setError('');
    try {
      const { user, accessToken } = await signupApi(
  values.username,
  values.password,
  values.interest
);
      window.alert(`${user.userId}님, 가입을 환영합니다!`);
      login(user, accessToken);
      navigate('/todos/all', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : '회원가입에 실패했습니다.');
      userInput.current?.focus();
    } finally {
      setPending(false);
    }
  }

  return (
    <Card>
      <h1>회원가입</h1>
      <Form onSubmit={handleSubmit}>
        <Field>
          아이디
          <TextInput
            type="text"
            ref={userInput}
            name="username"
            value={values.username}
            onChange={handleChange}
            autoComplete="username"
            required
            pattern="[A-Za-z0-9]{4,12}"
            title="영문과 숫자만 사용해 4~12자로 입력하세요."
            onInvalid={(event) => {
              if (event.currentTarget.validity.patternMismatch) {
                event.currentTarget.setCustomValidity('영문과 숫자만 사용해 4~12자로 입력하세요.');
              }
            }}
            aria-describedby="username-hint"
          />
          <small id="username-hint">영문과 숫자만 사용해 4~12자로 입력하세요.</small>
        </Field>

        <Field>
          비밀번호
          <TextInput
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            autoComplete="new-password"
            required
            minLength={8}
          />
        </Field>

        <Field>
          비밀번호 확인
          <TextInput
            ref={confirmInput}
            type="password"
            name="passwordConfirm"
            value={values.passwordConfirm}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />
        </Field>

        <Interests>
          <legend>관심 분야</legend>
          <label>
            <input type="radio" name="interest" value="frontend"
              checked={values.interest === 'frontend'} onChange={handleChange} />
            프론트엔드
          </label>
          <label>
            <input type="radio" name="interest" value="backend"
              checked={values.interest === 'backend'} onChange={handleChange} />
            백엔드
          </label>
        </Interests>

        <label>
          <input type="checkbox" name="agreed"
            checked={values.agreed} onChange={handleAgreementChange} />
          약관에 동의합니다.
        </label>

        <SubmitButton type="submit" disabled={!values.agreed || pending}>{pending ? '가입 중...' : '가입하기'}</SubmitButton>
      </Form>
      {error && <ErrorMessage role="alert">{error}</ErrorMessage>}
      <p><Link to="/login">로그인</Link></p>
    </Card>
  );
}
