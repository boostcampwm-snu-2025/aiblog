import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Node.js 내장 모듈 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 별칭(alias) 설정
  resolve: {
    alias: [
      // '@' 별칭을 'src' 디렉토리로 매핑
      { find: '@', replacement: path.resolve(__dirname, 'src') },
    ],
  },
});