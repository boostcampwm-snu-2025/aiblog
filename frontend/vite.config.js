import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // 클라이언트에서 /api 로 시작하는 요청은 http://localhost:5000 으로 포워딩됩니다.
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        //rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
