// import { relations } from 'drizzle-orm';
// import {
//   mysqlTable,
//   varchar,
//   text,
//   timestamp,
//   mysqlEnum,
//   int,
// } from 'drizzle-orm/mysql-core';

// // Users table
// export const users = mysqlTable('users', {
//   id: int('id').primaryKey().autoincrement(),
//   name: varchar('name', { length: 255 }).notNull(),
//   email: varchar('email', { length: 255 }).notNull().unique(),
//   password: varchar('password', { length: 255 }).notNull(),
//   role: mysqlEnum('role', ['user', 'admin']).default('user'),
//   createdAt: timestamp('created_at').defaultNow(),
//   updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
// });

// // Properties table
// export const properties = mysqlTable('properties', {
//   id: int('id').primaryKey().autoincrement(),
//   name: varchar('name', { length: 255 }).notNull(),
//   address: varchar('address', { length: 255 }).notNull(),
//   description: text('description'),
//   image: varchar('image', { length: 255 }),
//   ownerId: int('owner_id').references(() => users.id),
//   createdAt: timestamp('created_at').defaultNow(),
//   updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
// });

// // Units table (assuming you have units based on your relations)
// export const units = mysqlTable('units', {
//   id: int('id').primaryKey().autoincrement(),
//   name: varchar('name', { length: 255 }).notNull(),
//   propertyId: int('property_id').references(() => properties.id),
//   createdAt: timestamp('created_at').defaultNow(),
//   updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
// });

// // Rentals table (assuming you have rentals based on your relations)
// export const rentals = mysqlTable('rentals', {
//   id: int('id').primaryKey().autoincrement(),
//   unitId: int('unit_id').references(() => units.id),
//   startDate: timestamp('start_date').notNull(),
//   endDate: timestamp('end_date').notNull(),
//   createdAt: timestamp('created_at').defaultNow(),
//   updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
// });

// // Define relations
// export const usersRelations = relations(users, ({ many }) => ({
//   properties: many(properties),
// }));

// export const propertiesRelations = relations(properties, ({ one, many }) => ({
//   owner: one(users, {
//     fields: [properties.ownerId],
//     references: [users.id],
//   }),
//   units: many(units),
// }));

// export const unitsRelations = relations(units, ({ one, many }) => ({
//   property: one(properties, {
//     fields: [units.propertyId],
//     references: [properties.id],
//   }),
//   rentals: many(rentals),
// }));

// export const rentalsRelations = relations(rentals, ({ one }) => ({
//   unit: one(units, {
//     fields: [rentals.unitId],
//     references: [units.id],
//   }),
// }));
