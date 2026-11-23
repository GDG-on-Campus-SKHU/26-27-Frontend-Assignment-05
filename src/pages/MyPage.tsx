import { useState, useRef } from "react";
import type { ChangeEvent, DragEvent, FormEvent } from "react";
import styled from "styled-components";
import { updateTrackApi } from "../api/auth";
import { useAuthStore } from "../store/useAuthStore";
import { resizeImageToDataUrl } from "../utils/image";
import type { Track } from "../types/user";
import {
  Card,
  Title,
  Subtitle,
  Form,
  Field,
  Label,
  SubmitButton,
  ErrorMessage,
} from "../styles/formStyles";

const ProfileRow = styled.div`
  display: flex;
  align-items: stretch;
  gap: 20px;
  margin-bottom: 28px;
  flex-wrap: wrap;
`;

const InfoBox = styled.div`
  flex: 1;
  min-width: 240px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
  padding: 20px 28px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  font-size: 15px;
`;

const InfoLabel = styled.span`
  width: 76px;
  font-weight: 600;
  color: #64748b;
  flex-shrink: 0;
`;

const InfoValue = styled.span`
  font-weight: 700;
  color: #0f172a;
`;

const TrackBadge = styled.span`
  padding: 4px 10px;
  border-radius: 6px;
  background-color: #eff6ff;
  color: #2563eb;
  font-size: 13px;
  font-weight: 700;
`;

const PhotoBox = styled.div<{ $isDragging: boolean; $hasPhoto: boolean }>`
  width: 260px;
  min-height: 176px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px;
  background-color: ${({ $isDragging }) => ($isDragging ? "#eff6ff" : "#f8fafc")};
  border: 1.5px ${({ $hasPhoto }) => ($hasPhoto ? "solid" : "dashed")}
    ${({ $isDragging, $hasPhoto }) =>
      $isDragging ? "#3b82f6" : $hasPhoto ? "#e2e8f0" : "#cbd5e1"};
  border-radius: 12px;
  color: #64748b;
  font-size: 13px;
  text-align: center;
  transition: all 0.15s ease;
`;

const PhotoPreview = styled.img`
  width: 88px;
  height: 88px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #ffffff;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.12);
`;

const PhotoIcon = styled.span`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background-color: #e2e8f0;
  color: #64748b;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const PhotoHint = styled.span`
  font-size: 12px;
  color: #94a3b8;
`;

const PhotoActions = styled.div`
  display: flex;
  gap: 8px;
`;

const PhotoButton = styled.button<{ $danger?: boolean }>`
  padding: 6px 12px;
  border: 1px solid ${({ $danger }) => ($danger ? "#fecaca" : "#cbd5e1")};
  border-radius: 8px;
  background-color: #ffffff;
  color: ${({ $danger }) => ($danger ? "#dc2626" : "#334155")};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease;

  &:hover:not(:disabled) {
    background-color: ${({ $danger }) => ($danger ? "#fef2f2" : "#f1f5f9")};
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const PhotoError = styled.p`
  margin: 0;
  font-size: 12px;
  font-weight: 600;
  color: #dc2626;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e2e8f0;
  margin: 0 0 24px;
`;

const TrackChipGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
`;

const TrackChipCard = styled.label<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 18px;
  border: 1.5px solid ${({ $selected }) => ($selected ? "#3b82f6" : "#e2e8f0")};
  border-radius: 12px;
  background-color: ${({ $selected }) => ($selected ? "#eff6ff" : "#ffffff")};
  color: ${({ $selected }) => ($selected ? "#1d4ed8" : "#334155")};
  font-size: 15px;
  font-weight: ${({ $selected }) => ($selected ? 700 : 600)};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: ${({ $selected }) => ($selected ? "#3b82f6" : "#cbd5e1")};
    background-color: ${({ $selected }) => ($selected ? "#eff6ff" : "#f8fafc")};
  }
`;

const HiddenRadio = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
`;

const ChipCheckIcon = styled.span<{ $selected: boolean }>`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1.5px solid ${({ $selected }) => ($selected ? "#3b82f6" : "#cbd5e1")};
  background-color: ${({ $selected }) => ($selected ? "#3b82f6" : "#ffffff")};
  color: ${({ $selected }) => ($selected ? "#ffffff" : "transparent")};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s ease;
`;

const trackOptions: { value: Track; label: string }[] = [
  { value: "frontend", label: "프론트엔드" },
  { value: "backend", label: "백엔드" },
];

export default function MyPage() {
  const user = useAuthStore((state) => state.user);
  const updateTrack = useAuthStore((state) => state.updateTrack);
  // 현재 로그인한 계정의 프로필 사진과 변경·삭제 액션 구독
  const profilePhoto = useAuthStore((state) =>
    state.user ? state.profilePhotos[state.user.userId] : undefined,
  );
  const setProfilePhoto = useAuthStore((state) => state.setProfilePhoto);
  const removeProfilePhoto = useAuthStore((state) => state.removeProfilePhoto);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedTrack, setSelectedTrack] = useState<Track>(
    user?.track ?? "frontend",
  );
  // 관심 분야 저장 요청의 로딩·오류 상태
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  // 프로필 사진 업로드·드래그앤드롭 상태
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [photoError, setPhotoError] = useState("");

  if (!user) {
    return null;
  }

  const trackLabel = user.track === "frontend" ? "프론트엔드" : "백엔드";
  const isTrackChanged = selectedTrack !== user.track;
  const canSubmit = isTrackChanged && !isSaving;

  // 선택한 이미지 파일을 최대 320px로 압축해 계정별 프로필 사진으로 저장
  const handlePhotoFile = async (file: File) => {
    setPhotoError("");
    setIsProcessingPhoto(true);
    try {
      const dataUrl = await resizeImageToDataUrl(file);
      setProfilePhoto(user.userId, dataUrl);
    } catch (err) {
      setPhotoError(
        err instanceof Error ? err.message : "사진을 불러오지 못했습니다.",
      );
    } finally {
      setIsProcessingPhoto(false);
    }
  };

  // 파일 선택 창에서 이미지 선택 시 처리
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      void handlePhotoFile(file);
    }
    // 같은 파일을 다시 선택해도 onChange가 동작하도록 초기화
    e.target.value = "";
  };

  // 프로필 사진 영역 드래그 앤 드롭 핸들러
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      void handlePhotoFile(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoError("");
    removeProfilePhoto(user.userId);
  };

  // 관심 분야 변경 저장 (PATCH /users/me): 성공 시에만 스토어를 갱신하고 실패 시 오류 문구만 표시
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isTrackChanged || isSaving) return;

    setError("");
    setIsSaving(true);

    try {
      const updatedUser = await updateTrackApi(selectedTrack);
      updateTrack(updatedUser.track);
      window.alert("관심 분야를 변경했습니다.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "관심 분야 변경에 실패했습니다.";
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <Title>마이페이지</Title>
      <Subtitle>
        내 계정 정보와 프로필 사진을 확인하고 관심 분야를 변경할 수 있습니다.
      </Subtitle>

      <ProfileRow>
        <InfoBox>
          <InfoRow>
            <InfoLabel>아이디</InfoLabel>
            <InfoValue>{user.userId}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>관심 분야</InfoLabel>
            <TrackBadge>{trackLabel}</TrackBadge>
          </InfoRow>
        </InfoBox>

        <PhotoBox
          $isDragging={isDragging}
          $hasPhoto={Boolean(profilePhoto)}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <HiddenFileInput
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            aria-label="프로필 사진 업로드"
          />

          {profilePhoto ? (
            <>
              <PhotoPreview
                src={profilePhoto}
                alt={`${user.userId}의 프로필 사진`}
              />
              <PhotoActions>
                <PhotoButton
                  type="button"
                  disabled={isProcessingPhoto}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isProcessingPhoto ? "처리 중..." : "사진 변경"}
                </PhotoButton>
                <PhotoButton
                  type="button"
                  $danger
                  disabled={isProcessingPhoto}
                  onClick={handleRemovePhoto}
                >
                  삭제
                </PhotoButton>
              </PhotoActions>
            </>
          ) : (
            <>
              <PhotoIcon aria-hidden="true">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </PhotoIcon>
              <span>프로필 사진</span>
              <PhotoHint>클릭하거나 이미지를 끌어다 놓으세요</PhotoHint>
              <PhotoButton
                type="button"
                disabled={isProcessingPhoto}
                onClick={() => fileInputRef.current?.click()}
              >
                {isProcessingPhoto ? "처리 중..." : "사진 추가"}
              </PhotoButton>
            </>
          )}

          {photoError && <PhotoError role="alert">{photoError}</PhotoError>}
        </PhotoBox>
      </ProfileRow>

      <Divider />

      <Form onSubmit={handleSubmit}>
        <Field>
          <Label as="span">관심 분야 변경</Label>
          <TrackChipGroup>
            {trackOptions.map((option) => {
              const isSelected = selectedTrack === option.value;
              return (
                <TrackChipCard key={option.value} $selected={isSelected}>
                  <HiddenRadio
                    type="radio"
                    name="track"
                    value={option.value}
                    checked={isSelected}
                    disabled={isSaving}
                    onChange={() => setSelectedTrack(option.value)}
                  />
                  <span>{option.label}</span>
                  <ChipCheckIcon $selected={isSelected} aria-hidden="true">
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </ChipCheckIcon>
                </TrackChipCard>
              );
            })}
          </TrackChipGroup>
        </Field>

        <SubmitButton type="submit" disabled={!canSubmit} $active={canSubmit}>
          {isSaving ? "저장 중..." : "저장"}
        </SubmitButton>
      </Form>

      {error && <ErrorMessage role="alert">{error}</ErrorMessage>}
    </Card>
  );
}
