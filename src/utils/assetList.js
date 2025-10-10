// src/utils/assetList.js

export const assetList = [
  // 폰트 (가벼움)
  { 
    type: "font", 
    family: "Pretendard", 
    weight: 100 
  },
  // 더미 이미지 자산 (경로 의존 X, 항상 로드 성공)
  // 1x1 transparent PNG (base64). 이미지 로더가 최소 1개 이상 존재해야 
  // 프리로더가 즉시 스킵되지 않는 환경에서 안정적으로 동작합니다.
  {
    type: "image",
    src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=="
  }
];

// 참고: 
// - 이미지 경로가 정확하지 않으면 로딩이 멈춥니다
// - 테스트를 위해 폰트만 남겨두었습니다
// - 프리로더가 작동하면 나중에 실제 이미지를 추가하세요