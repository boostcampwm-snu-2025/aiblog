import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        proxy: {
            // '/api'로 시작하는 모든 요청을
            // 'http://localhost:8000' (백엔드 서버)로 보냅니다.
            "/api": {
                target: "http://localhost:8000",
                changeOrigin: true, // CORS를 위해 호스트 헤더를 변경
            },
        },
    },
});
