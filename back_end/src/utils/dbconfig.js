import { createConnection } from 'mysql2';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

// Database settings that allow for connection SQL
const db = createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

export default db;