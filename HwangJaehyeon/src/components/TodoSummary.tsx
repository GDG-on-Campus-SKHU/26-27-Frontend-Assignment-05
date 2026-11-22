import styled from 'styled-components';
import type { TodoSummaryProps } from '../types';
import { Button } from './ui';

const Summary = styled.div`
  /* 개수는 왼쪽, 정렬 버튼은 오른쪽에 놓는다. 세로 가운데를 맞추고 추가 폼과의 위쪽 간격 추가함 */
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 16px;
`;

export default function TodoSummary({ totalCount, doneCount, onSort }: TodoSummaryProps) {
  return (
    <Summary>
      <span>전체 {totalCount}개 / 완료 {doneCount}개</span>
      <Button type="button" onClick={onSort} disabled={totalCount < 2}>
        이름순 정렬
      </Button>
    </Summary>
  );
}
