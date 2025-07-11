# GitHub 업로드 가이드

## 리포지토리: https://github.com/dth0108/youthtrader_10

### 필수 업로드 파일 목록

#### 1. 프로젝트 설정 파일
- `package.json` - 의존성 및 스크립트
- `package-lock.json` - 정확한 의존성 버전
- `tsconfig.json` - TypeScript 설정
- `tailwind.config.ts` - Tailwind CSS 설정
- `vite.config.ts` - Vite 빌드 설정
- `drizzle.config.ts` - 데이터베이스 설정
- `postcss.config.js` - PostCSS 설정
- `components.json` - shadcn/ui 설정

#### 2. 문서 파일
- `README.md` - 프로젝트 설명
- `replit.md` - 기술 문서
- `.gitignore` - Git 무시 파일

#### 3. 소스 코드 폴더
- `client/` - 전체 프론트엔드 폴더
- `server/` - 전체 백엔드 폴더  
- `shared/` - 공유 스키마 폴더

### GitHub 웹 업로드 단계

1. **리포지토리 페이지로 이동**
   - https://github.com/dth0108/youthtrader_10

2. **파일 업로드**
   - "uploading an existing file" 클릭
   - 또는 "Add file" → "Upload files"

3. **폴더별 업로드**
   - 각 폴더를 개별적으로 드래그&드롭
   - 또는 파일을 선택하여 업로드

4. **커밋 메시지 작성**
   ```
   Initial commit: 청년 무역 인턴 그룹 미팅 설문 시스템
   
   - Multi-step survey platform
   - PostgreSQL database integration
   - Animal avatar system with MZ nicknames
   - Real-time statistics and restaurant recommendations
   - Mobile-responsive design with dark theme
   ```

### 중요 사항
- `node_modules/` 폴더는 업로드하지 마세요
- `.git/` 폴더는 업로드하지 마세요
- `dist/` 폴더는 업로드하지 마세요

### 업로드 완료 후 
다른 환경에서 프로젝트를 실행하려면:
```bash
npm install
npm run db:push
npm run dev
```