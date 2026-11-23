import { useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router';
import { fakeLoginApi } from '../api/auth';
import { useAuthStore } from '../stores/useAuthStore';
import {
  Title,
  Form,
  Field,
  Label,
  Input,
  OptionLabel,
  SubmitButton,
  ErrorMessage,
  FormLink,
} from '../styles/FormStyles';

export default function Login() {
  const [formState, setFormState] = useState(() => {
    const savedUserId = localStorage.getItem('saved-user-id') ?? '';
    return { userId: savedUserId, password: '', saveId: savedUserId !== '' };
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const passwordRef = useRef<HTMLInputElement>(null);
  const login = useAuthStore((state) => state.login);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, saveId: e.target.checked }));
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setError('');
    setIsSubmitting(true);
    try {
      const { user, accessToken } = await fakeLoginApi(formState.userId, formState.password);
      if (formState.saveId) {
        localStorage.setItem('saved-user-id', formState.userId);
      } else {
        localStorage.removeItem('saved-user-id');
      }
      login(user, accessToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다. 다시 시도해 주세요.');
      setFormState((prev) => ({ ...prev, password: '' }));
      passwordRef.current?.focus();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section>
      <Title>로그인</Title>
      <Form onSubmit={submitHandler} aria-busy={isSubmitting}>
        <Field>
          <Label htmlFor="login-userId">아이디</Label>
          <Input
            id="login-userId"
            name="userId"
            type="text"
            autoComplete="username"
            value={formState.userId}
            onChange={handleChange}
            required
          />
        </Field>
        <Field>
          <Label htmlFor="login-password">비밀번호</Label>
          <Input
            ref={passwordRef}
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={formState.password}
            onChange={handleChange}
            required
          />
        </Field>
        <OptionLabel>
          <input type="checkbox" checked={formState.saveId} onChange={handleCheckboxChange} />
          아이디 저장
        </OptionLabel>
        <SubmitButton type="submit" $active={!isSubmitting} disabled={isSubmitting}>
          {isSubmitting ? '로그인 중...' : '로그인'}
        </SubmitButton>
      </Form>
      {error && <ErrorMessage role="alert">{error}</ErrorMessage>}
      <FormLink>
        아직 계정이 없나요? <Link to="/signup">회원가입</Link>
      </FormLink>
    </section>
  );
}
