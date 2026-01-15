import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';

// Load env vars from parent directory (backend root)
dotenv.config();

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database configuration
const config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
};

const pool = new Pool(config);

const runMigrations = async () => {
    const client = await pool.connect();

    try {
        console.log('🔄 Starting database migrations...');

        // Start transaction
        await client.query('BEGIN');

        // Get migration files
        const migrationsDir = path.join(__dirname, '../migrations');
        const files = fs.readdirSync(migrationsDir)
            .filter(file => file.endsWith('.sql'))
            .sort(); // Sort makes sure 000 runs before 001

        console.log(`📂 Found ${files.length} migration files.`);

        for (const file of files) {
            console.log(`▶️ Running migration: ${file}`);
            const filePath = path.join(migrationsDir, file);
            const sql = fs.readFileSync(filePath, 'utf8');

            await client.query(sql);
            console.log(`✅ Completed: ${file}`);
        }

        // Commit transaction
        await client.query('COMMIT');
        console.log('🎉 All migrations completed successfully!');

    } catch (error) {
        // Rollback on error
        await client.query('ROLLBACK');
        console.error('❌ Migration failed:', error);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
};

runMigrations();
