import { Client } from "pg";
import config from "./config";

export function getClient(postgresUrl: string): Client {
    return new Client({
        connectionString: config.POSTGRES_URL,
    });
}