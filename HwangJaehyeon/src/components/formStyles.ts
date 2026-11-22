import styled from 'styled-components';
import { PrimaryButton } from './ui';

// 로그인과 회원가입에서 같은 간격을 사용하려고 공통 폼을 만들었다.
export const Form = styled.form`
  /* 입력 항목을 한 줄씩 쌓고 항목 사이에 일정한 여백을 둔다. */
  display: grid;
  gap: 16px;
  /* 넓은 화면에서도 입력창이 너무 길어지지 않게 제한한다. */
  max-width: 440px;
  margin-top: 24px;
`;

export const Field = styled.label`
  /* label로 감싸면 글자를 눌러도 입력창에 초점이 간다.
     grid를 사용해서 항목 이름, 입력창, 도움말을 세로로 배치했다. */
  display: grid;
  gap: 6px;
`;

export const Interests = styled.fieldset`
  /* 두 라디오 버튼은 가로로 나열하고, 공간이 부족하면 다음 줄로 넘긴다. */
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  /* fieldset의 기본 바깥 여백을 없애 다른 입력창과 시작선을 맞춘다. */
  margin: 0;
  border: 1px solid #cdd5e4;
  border-radius: 8px;
`;

export const SubmitButton = styled(PrimaryButton)`
  /* grid 안에서 버튼이 폼 너비 전체로 늘어나지 않게 한다. */
  justify-self: start;
`;

export const ErrorMessage = styled.p`
  /* 오류는 폼 아래에 표시하고 배경색과 글자색을 함께 구분했다. */
  padding: 12px;
  border-radius: 8px;
  color: #b42318;
  background: #fff1f0;
  /* 서버에서 긴 오류 문구가 와도 카드 밖으로 나가지 않게 한다. */
  overflow-wrap: anywhere;
`;
