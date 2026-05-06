import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { offeringsTable } from "./offerings";

export const useCasesTable = pgTable("use_cases", {
  id: serial("id").primaryKey(),
  offeringId: integer("offering_id").notNull().references(() => offeringsTable.id, { onDelete: "cascade" }),
  companyIconUrl: text("company_icon_url"),
  projectName: text("project_name").notNull(),
  industryType: text("industry_type").notNull(),
  description: text("description").notNull(),
  previousState: text("previous_state").notNull(),
  newState: text("new_state").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertUseCaseSchema = createInsertSchema(useCasesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUseCase = z.infer<typeof insertUseCaseSchema>;
export type UseCase = typeof useCasesTable.$inferSelect;
