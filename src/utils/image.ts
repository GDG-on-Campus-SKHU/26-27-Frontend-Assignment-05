// 프로필 사진 리사이즈·압축 기준 (최대 320px, 원본 파일 10MB 제한)
const MAX_DIMENSION = 320;
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

/**
 * 선택한 이미지 파일을 최대 320px 이하로 리사이즈·압축하여 JPEG Data URL로 변환한다.
 * 브라우저 localStorage 용량 초과(약 5MB 제한)를 방지하고 썸네일이 가볍게 저장되도록 한다.
 */
export function resizeImageToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // 1) 이미지 MIME 타입 및 원본 파일 용량 검증
    if (!file.type.startsWith("image/")) {
      reject(new Error("이미지 파일(JPG, PNG, GIF, WebP 등)만 업로드할 수 있습니다."));
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      reject(new Error("이미지 파일 크기는 10MB 이하만 가능합니다."));
      return;
    }

    // 2) FileReader로 파일을 Data URL로 읽은 뒤 Image 객체에 로드
    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error("이미지 파일을 읽지 못했습니다."));
    };

    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("이미지 데이터를 변환하지 못했습니다."));
        return;
      }

      const img = new Image();
      img.onerror = () => {
        reject(new Error("올바른 이미지 파일이 아닙니다."));
      };

      // 3) 원본 비율을 유지하면서 Canvas에 축소해 그리고 JPEG(품질 0.85)로 압축
      img.onload = () => {
        const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(result);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };

      img.src = result;
    };

    reader.readAsDataURL(file);
  });
}
