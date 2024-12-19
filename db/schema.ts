import { relations } from "drizzle-orm";
import { boolean, integer, pgEnum, pgTable, numeric, text, timestamp } from "drizzle-orm/pg-core";

// Users table
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
});

export const usersRelations = relations(users, ({ many }) => ({
  reports: many(reports),
  notifications: many(notifications),
}));

// Enum for report status
export const reportStatusEnum = pgEnum("report_status", ["detected", "not_detected"]);

// Reports table
export const reports = pgTable("reports", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  province: text("province").notNull(),
  city: text("city").notNull(),
  district: text("district").notNull(),
  description: text("description"),
  status: reportStatusEnum("status").notNull().default("not_detected"),
  createdAt: timestamp("created_at").defaultNow().notNull(), // Use timestamp without timezone
  image: text("image"), // Store file path or URL
});

export const reportsRelations = relations(reports, ({ one }) => ({
  user: one(users, {
    fields: [reports.userId],
    references: [users.id],
  }),
}));

// Notifications table
export const notifications = pgTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  reportId: text("report_id").references(() => reports.id, { onDelete: "cascade" }).notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(), // Use timestamp without timezone
});

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
  report: one(reports, {
    fields: [notifications.reportId],
    references: [reports.id],
  }),
}));

// Heatmap data table
export const heatmapData = pgTable("heatmap_data", {
  id: text("id").primaryKey(),
  reportId: text("report_id").references(() => reports.id, { onDelete: "cascade" }).notNull(),
  province: text("province").notNull(),
  city: text("city").notNull(),
  district: text("district").notNull(),
  latitude: numeric("latitude", { precision: 9, scale: 6 }).notNull(),
  longitude: numeric("longitude", { precision: 9, scale: 6 }).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(), // Use timestamp without timezone
  intensity: integer("intensity").notNull().default(1),
});

export const heatmapDataRelations = relations(heatmapData, ({ one }) => ({
  report: one(reports, {
    fields: [heatmapData.reportId],
    references: [reports.id],
  }),
}));
