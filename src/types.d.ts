/// <reference types="vite/client" />

interface ImportMeta {
    env: {
        VITE_API_URL: string;
        NODE_ENV: string;
        // Add other environment variables you use
    };
}