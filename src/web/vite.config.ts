import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
    plugins: [
        react(),
    ],
    build: {
        chunkSizeWarningLimit: 1000,
    },
    preview: {
        port: 8080,
    },
    server: {
        port: 8080,
    },
});
