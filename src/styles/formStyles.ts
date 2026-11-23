import { Link } from "react-router";
import styled from "styled-components";

export const Card = styled.section`
  padding: 36px 28px;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
`;

export const Title = styled.h1`
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 8px;
`;

export const Subtitle = styled.p`
  font-size: 14px;
  color: #64748b;
  margin: 0 0 28px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const LabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #334155;
`;

export const Input = styled.input`
  padding: 11px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-size: 15px;
  color: #0f172a;
  background-color: #ffffff;
  outline: none;
  transition: border-color 0.15s ease;

  &:focus {
    border-color: #3b82f6;
  }
`;

export const RadioGroup = styled.div`
  display: flex;
  gap: 16px;
`;

export const RadioLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #334155;
  cursor: pointer;
`;

export const CheckboxLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #334155;
  cursor: pointer;
  width: fit-content;
`;

export const SubmitButton = styled.button<{ $active: boolean }>`
  margin-top: 4px;
  padding: 14px 18px;
  border: ${({ $active }) => ($active ? "none" : "1px solid #cbd5e1")};
  border-radius: 10px;
  background-color: ${({ $active }) => ($active ? "#3b82f6" : "#e2e8f0")};
  color: ${({ $active }) => ($active ? "#ffffff" : "#94a3b8")};
  font-size: 15px;
  font-weight: 700;
  cursor: ${({ $active }) => ($active ? "pointer" : "not-allowed")};
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    background-color: #2563eb;
  }
`;

export const ErrorMessage = styled.p`
  margin: 16px 0 0;
  padding: 12px 14px;
  border-radius: 10px;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  font-size: 14px;
  font-weight: 600;
`;

export const BottomText = styled.p`
  margin: 20px 0 0;
  padding-top: 20px;
  border-top: 1px solid #f1f5f9;
  text-align: center;
  font-size: 14px;
  color: #64748b;
`;

export const BottomLink = styled(Link)`
  margin-left: 6px;
  color: #3b82f6;
  font-weight: 700;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
