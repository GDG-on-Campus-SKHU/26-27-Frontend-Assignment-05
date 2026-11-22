import { useRef, useState } from 'react';
import type { ChangeEvent, SyntheticEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { loginApi } from '../api/auth'; // loginAPI를 사용하기 위해 수정
import { useAuthStore } from '../stores/useAuthStore';
import { Card, TextInput } from '../components/ui';
import { Form, Field, SubmitButton, ErrorMessage } from '../components/formStyles';

export default function LoginPage() {
  const [values, setValues] = useState(() => ({ userId: localStorage.getItem('saved-user-id') ?? '', password: '' }));
  const [remember, setRemember] = useState(() => !!localStorage.getItem('saved-user-id'));
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const passwordInput = useRef<HTMLInputElement>(null);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.currentTarget;
    setValues((previous) => ({ ...previous, [name]: value }));
  }

  // API로의 통신을 위한 handleSubmit 함수 변경
  async function handleSubmit(
    event: SyntheticEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (pending) return;

    setPending(true);
    setError('');

    try {
      const { user, accessToken } = await loginApi(
        values.userId,
        values.password
      );

      remember
        ? localStorage.setItem('saved-user-id', values.userId)
        : localStorage.removeItem('saved-user-id');

      login(user, accessToken);

      navigate('/todos/all', { replace: true });

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : '로그인에 실패했습니다.'
      );

      setValues((previous) => ({
        ...previous,
        password: ''
      }));

      passwordInput.current?.focus();

    } finally {
      setPending(false);
    }
  }

  return <Card>
    <h1>로그인</h1>
    <Form onSubmit={handleSubmit}>
      <Field>아이디<TextInput name="userId" type="text" autoComplete="username" required value={values.userId} onChange={handleChange} /></Field>
      <Field>비밀번호<TextInput ref={passwordInput} name="password" type="password" autoComplete="current-password" required value={values.password} onChange={handleChange} /></Field>
      <label><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.currentTarget.checked)} />아이디 저장</label>
      <SubmitButton disabled={pending}>{pending ? '로그인 중...' : '로그인'}</SubmitButton>
    </Form>
    {error && <ErrorMessage role="alert">{error}</ErrorMessage>}
    <p><Link to="/signup">회원가입</Link></p>
  </Card>;
}
