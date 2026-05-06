import { Router, type IRouter } from "express";
import { eq, ilike, or, sql, count, avg, sum } from "drizzle-orm";
import { db, successCasesTable } from "@workspace/db";
import {
  ListSuccessCasesQueryParams,
  CreateSuccessCaseBody,
  GetSuccessCaseParams,
  UpdateSuccessCaseParams,
  UpdateSuccessCaseBody,
  DeleteSuccessCaseParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/success-cases/stats", async (req, res): Promise<void> => {
  const cases = await db.select().from(successCasesTable);

  const totalCases = cases.length;
  const uniqueClients = new Set(cases.map((c) => c.clientName)).size;

  let avgGovernance = 0;
  let avgWellArchitected = 0;
  let totalSavings = 0;

  if (totalCases > 0) {
    avgGovernance =
      cases.reduce((sum, c) => {
        const kpis = c.azureAnalyzerKpis as Record<string, number>;
        return sum + (kpis.governanceScore ?? 0);
      }, 0) / totalCases;

    avgWellArchitected =
      cases.reduce((sum, c) => {
        const kpis = c.azureAnalyzerKpis as Record<string, number>;
        return sum + (kpis.wellArchitectedScore ?? 0);
      }, 0) / totalCases;

    totalSavings = cases.reduce((sum, c) => {
      const findings = c.azureAuditorFindings as Record<string, unknown>;
      return sum + ((findings.costSavingsEstimate as number) ?? 0);
    }, 0);
  }

  const industryCounts: Record<string, number> = {};
  for (const c of cases) {
    const industry = c.industry ?? "Other";
    industryCounts[industry] = (industryCounts[industry] ?? 0) + 1;
  }

  const topIndustries = Object.entries(industryCounts)
    .map(([industry, count]) => ({ industry, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const recentCases = cases
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5)
    .map(formatCase);

  res.json({
    totalCases,
    totalClients: uniqueClients,
    avgGovernanceScore: Math.round(avgGovernance * 10) / 10,
    avgWellArchitectedScore: Math.round(avgWellArchitected * 10) / 10,
    totalCostSavings: totalSavings,
    topIndustries,
    recentCases,
  });
});

router.get("/success-cases", async (req, res): Promise<void> => {
  const parsed = ListSuccessCasesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { search, limit, offset } = parsed.data;

  let rows;
  let totalCount;

  if (search) {
    rows = await db
      .select()
      .from(successCasesTable)
      .where(
        or(
          ilike(successCasesTable.title, `%${search}%`),
          ilike(successCasesTable.clientName, `%${search}%`),
          ilike(successCasesTable.executiveSummary, `%${search}%`),
        ),
      )
      .limit(limit)
      .offset(offset)
      .orderBy(successCasesTable.createdAt);

    const [countResult] = await db
      .select({ count: count() })
      .from(successCasesTable)
      .where(
        or(
          ilike(successCasesTable.title, `%${search}%`),
          ilike(successCasesTable.clientName, `%${search}%`),
          ilike(successCasesTable.executiveSummary, `%${search}%`),
        ),
      );
    totalCount = Number(countResult?.count ?? 0);
  } else {
    rows = await db
      .select()
      .from(successCasesTable)
      .limit(limit)
      .offset(offset)
      .orderBy(successCasesTable.createdAt);

    const [countResult] = await db
      .select({ count: count() })
      .from(successCasesTable);
    totalCount = Number(countResult?.count ?? 0);
  }

  res.json({ cases: rows.map(formatCase), total: totalCount });
});

router.post("/success-cases", async (req, res): Promise<void> => {
  const parsed = CreateSuccessCaseBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [newCase] = await db
    .insert(successCasesTable)
    .values({
      title: parsed.data.title,
      clientName: parsed.data.clientName,
      executiveSummary: parsed.data.executiveSummary,
      azureAnalyzerKpis: parsed.data.azureAnalyzerKpis,
      azureAuditorFindings: parsed.data.azureAuditorFindings,
      discoveryMapUrl: parsed.data.discoveryMapUrl ?? null,
      industry: parsed.data.industry ?? null,
      publishedAt: parsed.data.publishedAt
        ? new Date(parsed.data.publishedAt)
        : null,
    })
    .returning();

  res.status(201).json(formatCase(newCase!));
});

router.get("/success-cases/:id", async (req, res): Promise<void> => {
  const params = GetSuccessCaseParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [caseRow] = await db
    .select()
    .from(successCasesTable)
    .where(eq(successCasesTable.id, params.data.id));

  if (!caseRow) {
    res.status(404).json({ error: "Success case not found" });
    return;
  }

  res.json(formatCase(caseRow));
});

router.put("/success-cases/:id", async (req, res): Promise<void> => {
  const params = UpdateSuccessCaseParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateSuccessCaseBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updateData: Record<string, unknown> = {};
  if (parsed.data.title != null) updateData.title = parsed.data.title;
  if (parsed.data.clientName != null)
    updateData.clientName = parsed.data.clientName;
  if (parsed.data.executiveSummary != null)
    updateData.executiveSummary = parsed.data.executiveSummary;
  if (parsed.data.azureAnalyzerKpis != null)
    updateData.azureAnalyzerKpis = parsed.data.azureAnalyzerKpis;
  if (parsed.data.azureAuditorFindings != null)
    updateData.azureAuditorFindings = parsed.data.azureAuditorFindings;
  if ("discoveryMapUrl" in parsed.data)
    updateData.discoveryMapUrl = parsed.data.discoveryMapUrl;
  if ("industry" in parsed.data) updateData.industry = parsed.data.industry;
  if ("publishedAt" in parsed.data)
    updateData.publishedAt = parsed.data.publishedAt
      ? new Date(parsed.data.publishedAt as string)
      : null;

  const [updated] = await db
    .update(successCasesTable)
    .set(updateData)
    .where(eq(successCasesTable.id, params.data.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Success case not found" });
    return;
  }

  res.json(formatCase(updated));
});

router.delete("/success-cases/:id", async (req, res): Promise<void> => {
  const params = DeleteSuccessCaseParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [deleted] = await db
    .delete(successCasesTable)
    .where(eq(successCasesTable.id, params.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Success case not found" });
    return;
  }

  res.sendStatus(204);
});

function formatCase(c: typeof successCasesTable.$inferSelect) {
  return {
    id: c.id,
    title: c.title,
    clientName: c.clientName,
    executiveSummary: c.executiveSummary,
    azureAnalyzerKpis: c.azureAnalyzerKpis,
    azureAuditorFindings: c.azureAuditorFindings,
    discoveryMapUrl: c.discoveryMapUrl ?? null,
    industry: c.industry ?? null,
    publishedAt: c.publishedAt ? c.publishedAt.toISOString() : null,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  };
}

export default router;
