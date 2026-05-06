import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const offeringsTable = pgTable("offerings", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  durationHours: text("duration_hours").notNull(),
  techPillar: text("tech_pillar").notNull(),
  businessBenefit: text("business_benefit").notNull(),
  whatIsIt: text("what_is_it").notNull(),
  whatDoesItSolve: text("what_does_it_solve").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertOfferingSchema = createInsertSchema(offeringsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertOffering = z.infer<typeof insertOfferingSchema>;
export type Offering = typeof offeringsTable.$inferSelect;
