// 임시 아이콘 생성 스크립트
const fs = require('fs');
const path = require('path');

// assets/images 디렉토리 생성
const assetsDir = path.join(__dirname, 'assets');
const imagesDir = path.join(assetsDir, 'images');

// 디렉토리가 없으면 생성
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir);
  console.log('Created: assets directory');
}

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir);
  console.log('Created: assets/images directory');
}

// 간단한 플레이스홀더 PNG 이미지 생성
// 이것은 100x100 오렌지색 사각형입니다
const createPlaceholderPNG = (size = 100, color = '#FF8A65') => {
  // 간단한 1x1 픽셀 PNG (base64)
  // 실제 프로덕션에서는 적절한 아이콘을 사용해야 합니다
  const transparentPixel = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
  return Buffer.from(transparentPixel, 'base64');
};

// 이미지 파일 생성
const imageConfigs = [
  { name: 'icon.png', size: 1024 },
  { name: 'splash.png', size: 2048 },
  { name: 'adaptive-icon.png', size: 1024 },
  { name: 'favicon.png', size: 48 }
];

imageConfigs.forEach(config => {
  const filePath = path.join(imagesDir, config.name);
  
  try {
    // 파일이 이미 존재하는지 확인
    if (fs.existsSync(filePath)) {
      console.log(`File already exists: ${filePath}`);
    } else {
      // 플레이스홀더 이미지 생성 및 저장
      const imageBuffer = createPlaceholderPNG(config.size);
      fs.writeFileSync(filePath, imageBuffer);
      console.log(`Created: ${filePath} (${config.size}x${config.size})`);
    }
  } catch (error) {
    console.error(`Error creating ${config.name}:`, error.message);
  }
});

console.log('\n✅ Temporary icons created successfully!');
console.log('⚠️  Note: Replace these placeholder images with actual app icons before production.');