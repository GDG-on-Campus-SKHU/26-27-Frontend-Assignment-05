import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export const LoadingMessage = styled.p`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin: 16px 0 0;
  padding: 32px 16px;
  border: 1px dashed #d1d5db;
  border-radius: 10px;
  color: #6b7280;

  &::before {
    content: '';
    width: 16px;
    height: 16px;
    border: 2px solid #dbe5ff;
    border-top-color: #4a7dff;
    border-radius: 50%;
    animation: ${spin} 0.8s linear infinite;
  }
`;

export const LoadError = styled.p`
  margin: 16px 0 0;
  padding: 20px 16px;
  border: 1px solid #ffc9c9;
  border-radius: 10px;
  background-color: #fff5f5;
  color: #d32f3c;
  line-height: 1.5;
  text-align: center;
  overflow-wrap: anywhere;
`;
