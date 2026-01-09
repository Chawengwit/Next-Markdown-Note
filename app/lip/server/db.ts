import { Client, QueryResult } from "pg";
import config from "./config";

export function getClient(): Client {
    return new Client({
        connectionString: config.POSTGRES_URL,
    });
}

export async function sql(
    sql: string, 
    values?: Array<any>
): Promise<QueryResult<any>> {
    const client = getClient();
    await client.connect();

    const res = await client.query(sql, values);
    await client.end();

    return res;
}