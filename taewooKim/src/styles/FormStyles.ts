import styled from 'styled-components';

export const Title = styled.h1`
  margin: 0 0 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #edf0f5;
  font-size: 28px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.label`
  font-weight: bold;
  color: #374151;
`;

export const Input = styled.input`
  width: 100%;
  min-width: 0;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background-color: #f8fafc;
  font: inherit;
  transition: border-color 0.15s;

  &:focus {
    background-color: white;
    border-color: #4a7dff;
    outline: 2px solid #dbe5ff;
  }
`;

export const InputRow = styled.div`
  display: flex;
  gap: 8px;
`;

export const CheckButton = styled.button`
  flex: none;
  padding: 10px 14px;
  border: 1px solid #4a7dff;
  border-radius: 8px;
  background-color: white;
  color: #315bbd;
  font-weight: bold;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 0.15s;

  &:hover:not(:disabled) {
    background-color: #f0f4ff;
  }

  &:disabled {
    border-color: #d1d5db;
    color: #9ca3af;
    cursor: not-allowed;
  }
`;

export const CheckMessage = styled.span<{ $available: boolean }>`
  font-size: 13px;
  color: ${({ $available }) => ($available ? '#1f9d55' : '#d32f3c')};
`;

export const Hint = styled.span`
  font-size: 13px;
  color: #6b7280;
`;

export const Fieldset = styled.fieldset`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin: 0;
  padding: 0;
  border: none;

  legend {
    margin-bottom: 6px;
    padding: 0;
    font-weight: bold;
    color: #374151;
  }
`;

export const OptionLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;

  input {
    accent-color: #4a7dff;
  }
`;

export const SubmitButton = styled.button<{ $active: boolean }>`
  padding: 12px;
  border: none;
  border-radius: 10px;
  background-color: ${({ $active }) => ($active ? '#4a7dff' : '#e2e8f0')};
  color: ${({ $active }) => ($active ? 'white' : '#66758b')};
  font-weight: bold;
  cursor: ${({ $active }) => ($active ? 'pointer' : 'not-allowed')};
  transition: background-color 0.15s;

  &:hover:not(:disabled) {
    background-color: #3366e6;
  }
`;

export const ErrorMessage = styled.p`
  margin: 16px 0 0;
  color: #d32f3c;
  line-height: 1.5;
`;

export const FormLink = styled.p`
  margin: 20px 0 0;
  color: #6b7280;
  text-align: center;

  a {
    color: #3366e6;
    text-underline-offset: 3px;
  }
`;
