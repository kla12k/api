// import { drizzle } from 'drizzle-orm/mysql2';
// import * as mysql from 'mysql2/promise';
// import * as schema from './schema';
// import { MySqlDatabase } from 'drizzle-orm/mysql2';

// // Create the connection
// const connection = mysql.createPool({
//   host: process.env.DB_HOST || 'localhost',
//   port: Number(process.env.DB_PORT) || 3306,
//   user: process.env.DB_USERNAME || 'root',
//   password: process.env.DB_PASSWORD || '',
//   database: process.env.DB_DATABASE || 'business_directory',
// });

// // Create the db instance
// export const db = drizzle(connection, {
//   schema,
//   mode: 'default',
// });

// // Export the database type
// export type DrizzleDB = typeof db;

// // Export a constant for dependency injection
// export const DRIZZLE_TOKEN = 'DRIZZLE';
