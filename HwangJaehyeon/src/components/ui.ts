import { Link } from 'react-router';
import styled, { css } from 'styled-components';

export const Card = styled.section`
  /* 페이지 내용은 카드로 감싸서 회색 배경과 구분함.  */
  padding: clamp(20px, 5vw, 32px);
  border: 1px solid #e0e5ef;
  border-radius: 16px;
  background: white;

  h1 { margin: 0 0 8px; }
`;

const buttonStyle = css`
  /* 버튼과 이동 링크의 모양을 맞추려고 css로 공통 스타일을 묶었다. */
  display: inline-block;
  padding: 8px 12px;
  border: 1px solid #cdd5e4;
  border-radius: 8px;
  color: #263247;
  background: white;
  text-decoration: none;
  cursor: pointer;
`;

export const Button = styled.button`
  /* 공통 버튼 스타일을 가져오고, 비활성화되면 흐린 배경과 커서로 클릭할 수 없다는 것을 표시했음. */
  ${buttonStyle}
  &:disabled {
    color: #566173;
    background: #e6eaf1;
    cursor: not-allowed;
  }
`;

export const PrimaryButton = styled(Button)`
/* Button의 여백과 테두리 모양은 그대로 사용한다. */
  color: white;
  background: #4f46e5;
  border-color: transparent;
`;

export const ButtonLink = styled(Link)`
  /* 화면 이동은 Link가 담당하고, 겉모양만 버튼과 같게 만듦. 클릭해도 페이지 전체를 새로고침되지 않게 처리했음. */
  ${buttonStyle}
`;

export const TextInput = styled.input`
   /* flex 안에서는 min-width를 0으로 두어 좁은 화면에서도 줄어들 수 있게 처리. */
  width: 100%;
  min-width: 0;
  padding: 9px 12px;
  border: 1px solid #cdd5e4;
  border-radius: 8px;
  color: inherit;
`;
