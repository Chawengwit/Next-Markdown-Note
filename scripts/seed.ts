import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";


import { getClient } from "../app/lip/server/db";

async function seed() {
    const client = getClient("");
    await client.connect();
    client.query("BEGIN");
    try {
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash("123123", saltRounds);
        
        await client.query(
            `INSERT INTO users (email, password_hash) VALUES ($1, $2)`,
            ["admin@mail.com", passwordHash]);

        const result = await client.query(`SELECT id FROM users WHERE email = $1`, ["admin@mail.com"]);
        const resUser = result.rows[0];
        console.log("resUser:", resUser);

        for (let i = 0; i < 10; i++) {
            console.log("create note:", i, "for demo"); 
            await client.query(
                "INSERT into notes (user_id, title, content) VALUES ($1, $2, $3)",
                [
                    resUser.id,
                    faker.lorem.words(5),
                    faker.lorem.paragraphs(3),
                ]
            );
        }

        // Create multiple users with notes
        for (let i = 0; i < 10; i++) {
            console.log("create user:", i, "for demo"); 
            const email = faker.internet.email().toLowerCase();
            const tempPasswordHash = passwordHash; // same password for all demo users

            await client.query(
                `INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id`,
                [email, tempPasswordHash]
            );
        }

        // Create notes for each user
        const usersRes = await client.query(`SELECT id FROM users`);
        for (const user of usersRes.rows) {
            for (let j = 0; j < 5; j++) {
                console.log("create note:", j, "for user:", user.id); 
                await client.query(
                    `INSERT INTO notes (user_id, title, content) VALUES ($1, $2, $3)`,
                    [
                        user.id,
                        faker.lorem.words(5),
                        faker.lorem.paragraphs(2),
                    ]
                );
            }
        }

        await client.query("COMMIT");

    } catch (error) {
        await client.query("ROLLBACK");
        console.log(error);

    } finally {
        await client.end();
    }

    await client.end(); // ensure the client is closed after operation
}

seed().catch((error) => {
    console.error("Error during seeding:", error);
    process.exit(1);
});