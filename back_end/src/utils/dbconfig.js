import { createConnection } from 'mysql2';

const db = createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Tr6218517719',
    database: 'bookstore'
});

export default db;