# export_project.py
import os
import datetime
from pathlib import Path

# 설정
PROJECT_NAME = "KindnessApp"
OUTPUT_FILE = f"kindness_app_snapshot_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.md"

# 포함할 확장자
INCLUDE_EXTENSIONS = {
    '.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.sql', 
    '.env', '.txt', '.yml', '.yaml'
}

# 제외할 디렉토리
EXCLUDE_DIRS = {
    'node_modules', '.git', '.expo', 'dist', 'build', 
    'ios/Pods', 'android/build', '.idea', '.vscode',
    '__pycache__', '.cache', 'coverage', '.next'
}

# 제외할 파일
EXCLUDE_FILES = {
    'package-lock.json', 'yarn.lock', '.DS_Store', 'Thumbs.db',
    '*.pyc', '*.pyo', '*.log', '*.tmp'
}

# 중요 파일 (우선 포함) - 프로젝트 핵심 파일들
IMPORTANT_FILES = [
    # 설정 파일
    'package.json',
    'app.json',
    'babel.config.js',
    'index.ts',
    'tsconfig.json',
    'metro.config.js',
    'eas.json',
    
    # 메인 레이아웃
    'app/_layout.tsx',
    
    # 탭 네비게이션
    'app/(tabs)/_layout.tsx',
    'app/(tabs)/index.tsx',
    'app/(tabs)/history.tsx',
    'app/(tabs)/settings.tsx',
    
    # 타입 정의
    'lib/types.ts',
    
    # 데이터베이스
    'lib/db/database.ts',
    
    # 유틸리티
    'lib/utils.ts',
    'lib/messages.ts',
    'lib/presets/kindness.ts',
    
    # 상태 관리
    'stores/kindnessStore.ts',
    'stores/settingsStore.ts',
    
    # 컴포넌트
    'components/share/ShareCard.tsx',
    
    # Hooks
    'hooks/useIAP.ts',
    
    # 체크리스트
    'checklist.md',
    
    # 스토어 자산
    'store_assets/app_description.txt',
    'assets/images/stickman_guide.txt',
]

def should_include_file(file_path):
    """파일 포함 여부 결정"""
    path = Path(file_path)
    
    # 제외할 파일
    if path.name in EXCLUDE_FILES:
        return False
    
    # 제외할 디렉토리 체크
    for part in path.parts:
        if part in EXCLUDE_DIRS:
            return False
    
    # 확장자 체크
    if path.suffix not in INCLUDE_EXTENSIONS:
        return False
    
    # 파일 크기 제한 (5MB)
    try:
        if path.stat().st_size > 5 * 1024 * 1024:
            return False
    except:
        pass
    
    return True

def get_file_tree(root_dir, prefix="", is_last=True):
    """디렉토리 트리 구조 생성"""
    tree_str = ""
    root_path = Path(root_dir)
    
    if root_path.is_file():
        return f"{prefix}{'└── ' if is_last else '├── '}{root_path.name}\n"
    
    items = []
    for item in root_path.iterdir():
        # 제외할 디렉토리 스킵
        if item.is_dir() and item.name in EXCLUDE_DIRS:
            continue
        # 제외할 파일 스킵
        if item.is_file() and item.name in EXCLUDE_FILES:
            continue
        items.append(item)
    
    # 디렉토리 먼저, 파일 나중에 정렬
    items.sort(key=lambda x: (not x.is_dir(), x.name.lower()))
    
    for i, item in enumerate(items):
        is_last_item = (i == len(items) - 1)
        
        if item.is_dir():
            tree_str += f"{prefix}{'└── ' if is_last_item else '├── '}{item.name}/\n"
            extension = prefix + ("    " if is_last_item else "│   ")
            subtree = get_file_tree(item, extension, is_last_item)
            if subtree:  # 빈 디렉토리 제외
                tree_str += subtree
        elif should_include_file(item):
            tree_str += f"{prefix}{'└── ' if is_last_item else '├── '}{item.name}\n"
    
    return tree_str

def read_file_content(file_path):
    """파일 내용 읽기"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except UnicodeDecodeError:
        try:
            with open(file_path, 'r', encoding='cp949') as f:
                return f.read()
        except:
            return "[Binary file or encoding error]"
    except Exception as e:
        return f"[Error reading file: {str(e)}]"

def export_project(root_dir="."):
    """프로젝트 내보내기"""
    output_content = []
    
    # 헤더
    output_content.append(f"# {PROJECT_NAME} - 차카게살자 (One act of kindness a day)")
    output_content.append(f"\n📅 Generated: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
    
    # 프로젝트 설명
    output_content.append("## 📱 Project Overview\n")
    output_content.append("React Native/Expo 기반 매일 선행 기록 앱")
    output_content.append("- 10초 간단 기록 (텍스트/프리셋/사진)")
    output_content.append("- 연속일(Streak) 추적")
    output_content.append("- 따뜻한 격려 메시지")
    output_content.append("- 공유 카드 생성")
    output_content.append("- 달력 뷰 & 기록 관리")
    output_content.append("- 인앱 구매 (개발자 후원)\n")
    
    # 1. 프로젝트 구조
    output_content.append("## 📁 Project Structure\n")
    output_content.append("```")
    output_content.append(get_file_tree(root_dir))
    output_content.append("```\n")
    
    # 2. 중요 파일 내용
    output_content.append("## 📄 Core Files\n")
    
    files_included = []
    for file_path in IMPORTANT_FILES:
        full_path = Path(root_dir) / file_path
        if full_path.exists():
            files_included.append(file_path)
            output_content.append(f"### 📌 {file_path}\n")
            
            # 파일 정보
            file_stats = full_path.stat()
            file_size = file_stats.st_size
            modified_time = datetime.datetime.fromtimestamp(file_stats.st_mtime)
            output_content.append(f"- Size: {file_size:,} bytes")
            output_content.append(f"- Modified: {modified_time.strftime('%Y-%m-%d %H:%M:%S')}\n")
            
            # 파일 확장자에 따른 코드 블록 언어 설정
            lang_map = {
                '.ts': 'typescript',
                '.tsx': 'typescriptreact',
                '.js': 'javascript',
                '.jsx': 'javascriptreact',
                '.json': 'json',
                '.sql': 'sql',
                '.env': 'bash',
                '.md': 'markdown',
                '.txt': 'text'
            }
            
            suffix = full_path.suffix
            lang = lang_map.get(suffix, '')
            
            output_content.append(f"```{lang}")
            output_content.append(read_file_content(full_path))
            output_content.append("```\n")
    
    # 3. 기타 프로젝트 파일
    output_content.append("## 📦 Additional Project Files\n")
    
    other_files_count = 0
    for root, dirs, files in os.walk(root_dir):
        # 제외할 디렉토리 건너뛰기
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        
        for file in files:
            file_path = Path(root) / file
            relative_path = file_path.relative_to(root_dir)
            relative_path_str = str(relative_path).replace('\\', '/')
            
            # 중요 파일은 이미 포함됨
            if relative_path_str in IMPORTANT_FILES:
                continue
            
            if should_include_file(file_path):
                other_files_count += 1
                output_content.append(f"### 📄 {relative_path}\n")
                
                suffix = file_path.suffix
                lang_map = {
                    '.ts': 'typescript',
                    '.tsx': 'typescriptreact',
                    '.js': 'javascript',
                    '.jsx': 'javascriptreact',
                    '.json': 'json',
                    '.sql': 'sql',
                    '.md': 'markdown',
                    '.txt': 'text'
                }
                lang = lang_map.get(suffix, '')
                
                output_content.append(f"```{lang}")
                output_content.append(read_file_content(file_path))
                output_content.append("```\n")
    
    # 4. 프로젝트 통계
    output_content.append("## 📊 Project Statistics\n")
    output_content.append(f"- Core files included: {len(files_included)}")
    output_content.append(f"- Additional files included: {other_files_count}")
    output_content.append(f"- Total files documented: {len(files_included) + other_files_count}\n")
    
    # 5. 설치 정보
    output_content.append("## 🔧 Installation & Setup\n")
    
    # package.json 정보
    package_json_path = Path(root_dir) / "package.json"
    if package_json_path.exists():
        import json
        try:
            with open(package_json_path, 'r', encoding='utf-8') as f:
                package_data = json.load(f)
                
                output_content.append("### Package Info\n")
                output_content.append(f"- Name: {package_data.get('name', 'N/A')}")
                output_content.append(f"- Version: {package_data.get('version', 'N/A')}")
                output_content.append(f"- Main: {package_data.get('main', 'N/A')}\n")
                
                if 'scripts' in package_data:
                    output_content.append("### Scripts\n")
                    output_content.append("```json")
                    output_content.append(json.dumps(package_data['scripts'], indent=2))
                    output_content.append("```\n")
                
                if 'dependencies' in package_data:
                    output_content.append("### Dependencies\n")
                    output_content.append("```json")
                    output_content.append(json.dumps(package_data['dependencies'], indent=2))
                    output_content.append("```\n")
                
                if 'devDependencies' in package_data:
                    output_content.append("### Dev Dependencies\n")
                    output_content.append("```json")
                    output_content.append(json.dumps(package_data['devDependencies'], indent=2))
                    output_content.append("```\n")
        except Exception as e:
            output_content.append(f"Error reading package.json: {str(e)}\n")
    
    # 6. 실행 명령어
    output_content.append("## 🚀 Quick Start Commands\n")
    output_content.append("```bash")
    output_content.append("# Install dependencies")
    output_content.append("npm install")
    output_content.append("")
    output_content.append("# Start development server")
    output_content.append("npx expo start")
    output_content.append("")
    output_content.append("# Clear cache and start")
    output_content.append("npx expo start -c")
    output_content.append("")
    output_content.append("# Android build")
    output_content.append("npx expo run:android")
    output_content.append("")
    output_content.append("# iOS build (Mac only)")
    output_content.append("npx expo run:ios")
    output_content.append("")
    output_content.append("# Production build with EAS")
    output_content.append("eas build --platform android --profile production")
    output_content.append("```\n")
    
    # 7. 주요 기능 요약
    output_content.append("## ✨ Key Features\n")
    output_content.append("### 오늘 탭")
    output_content.append("- 선행 텍스트 입력")
    output_content.append("- 프리셋 빠른 선택")
    output_content.append("- 사진 첨부 (구현 예정)")
    output_content.append("- 격려 메시지 애니메이션")
    output_content.append("- 연속일 큰 숫자 표시\n")
    
    output_content.append("### 기록 탭")
    output_content.append("- 달력 뷰 (월별)")
    output_content.append("- 기록 있는 날 꽃 아이콘")
    output_content.append("- 날짜별 상세 기록 보기")
    output_content.append("- 기록 삭제 기능\n")
    
    output_content.append("### 설정 탭")
    output_content.append("- 커스텀 프리셋 추가/삭제")
    output_content.append("- 프리셋 숨기기/보이기")
    output_content.append("- 인앱 구매 (개발자 후원)")
    output_content.append("- 알림 설정")
    output_content.append("- 앱 정보\n")
    
    output_content.append("### 공유 기능")
    output_content.append("- 졸라맨 + 꽃 이미지 카드")
    output_content.append("- 텍스트 공유 모드")
    output_content.append("- SNS/카톡 공유\n")
    
    # 8. TODO 리스트
    output_content.append("## 📝 TODO / Known Issues\n")
    output_content.append("- [ ] 사진 첨부 기능 완성")
    output_content.append("- [ ] 실제 인앱 구매 구현 (현재 모킹)")
    output_content.append("- [ ] 알림 기능 구현")
    output_content.append("- [ ] 데이터 백업/복원")
    output_content.append("- [ ] 졸라맨 이미지 생성")
    output_content.append("- [ ] 앱 아이콘 제작")
    output_content.append("- [ ] 스플래시 스크린")
    output_content.append("- [ ] 다크 모드 지원\n")
    
    # 파일 저장
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write('\n'.join(output_content))
    
    return OUTPUT_FILE

def main():
    print(f"🌼 Scanning {PROJECT_NAME} project...")
    print(f"📁 Working directory: {os.getcwd()}")
    print(f"⏰ Timestamp: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("-" * 50)
    
    try:
        output_file = export_project()
        
        file_size = os.path.getsize(output_file)
        file_size_mb = file_size / (1024 * 1024)
        
        print(f"\n✅ Export completed successfully!")
        print(f"📄 Output file: {output_file}")
        print(f"📊 File size: {file_size_mb:.2f} MB")
        print(f"\n💡 이 파일을 공유하여 전체 프로젝트 컨텍스트를 제공할 수 있습니다.")
        print(f"🔍 문제 해결이나 코드 리뷰 시 이 스냅샷을 활용하세요.")
        print(f"\n🌼 차카게살자 - One act of kindness a day! 🌼")
        
    except Exception as e:
        print(f"\n❌ Export failed: {str(e)}")
        print(f"Please check the error and try again.")
        import traceback
        traceback.print_exc()
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())