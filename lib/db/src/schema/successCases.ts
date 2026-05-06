import { pgTable, text, serial, timestamp, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const successCasesTable = pgTable("success_cases", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  clientName: text("client_name").notNull(),
  executiveSummary: text("executive_summary").notNull(),
  azureAnalyzerKpis: jsonb("azure_analyzer_kpis").notNull(),
  azureAuditorFindings: jsonb("azure_auditor_findings").notNull(),
  discoveryMapUrl: text("discovery_map_url"),
  industry: text("industry"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertSuccessCaseSchema = createInsertSchema(successCasesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertSuccessCase = z.infer<typeof insertSuccessCaseSchema>;
export type SuccessCase = typeof successCasesTable.$inferSelect;
