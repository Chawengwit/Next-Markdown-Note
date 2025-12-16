import { loadEnvConfig } from "@next/env";

// Load environment variables from .env file
loadEnvConfig(process.cwd());

const config = {
    POSTGRES_URL: process.env.POSTGRES_URL || "postgresql://user:password@localhost:5432/mydb",
};

export default config;