import 'dotenv/config';
import fs from 'fs/promises';
import mysql from 'mysql2/promise';

// Create a connection to the MySQL server 
const schemaPath = new URL('../sql/schema.sql', import.meta.url);
const schemaSql = await fs.readFile(schemaPath, 'utf-8');

const connection = await mysql.createConnection({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true,
});

try {
  const dbName = process.env.DB_NAME || 'dietapp';
  await connection.query(`DROP DATABASE IF EXISTS ${dbName}`);
  await connection.query(schemaSql);
  console.log('Base reiniciada y tablas creadas correctamente.');
} finally {
  await connection.end();
}
