import { loadEnvConfig } from "@next/env";

// Load environment variables from .env file
loadEnvConfig(process.cwd());

const config = {
    POSTGRES_URL: process.env.POSTGRES_URL || "postgresql://user:password@localhost:5432/mydb",
    JWT_SECRET: process.env.JWT_SECRET || "secret123",
    SALT_ROUNDS: process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS) : 10,
};

export default config;