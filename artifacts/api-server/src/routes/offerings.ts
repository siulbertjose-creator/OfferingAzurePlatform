import { Router, type IRouter } from "express";
import { eq, ilike, or } from "drizzle-orm";
import { db, offeringsTable, useCasesTable } from "@workspace/db";
import {
  CreateOfferingBody,
  UpdateOfferingBody,
  GetOfferingParams,
  UpdateOfferingParams,
  DeleteOfferingParams,
  ListUseCasesQueryParams,
  CreateUseCaseBody,
  GetUseCaseParams,
  UpdateUseCaseParams,
  DeleteUseCaseParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

// ─── Offerings ────────────────────────────────────────────────────────────────

router.get("/offerings", async (_req, res): Promise<void> => {
  const rows = await db.select().from(offeringsTable).orderBy(offeringsTable.id);
  res.json({ offerings: rows.map(formatOffering) });
});

router.post("/offerings", async (req, res): Promise<void> => {
  const parsed = CreateOfferingBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const [row] = await db.insert(offeringsTable).values(parsed.data).returning();
  res.status(201).json(formatOffering(row!));
});

router.get("/offerings/:id", async (req, res): Promise<void> => {
  const params = GetOfferingParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }

  const [row] = await db.select().from(offeringsTable).where(eq(offeringsTable.id, params.data.id));
  if (!row) { res.status(404).json({ error: "Offering not found" }); return; }

  res.json(formatOffering(row));
});

router.put("/offerings/:id", async (req, res): Promise<void> => {
  const params = UpdateOfferingParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }

  const parsed = UpdateOfferingBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const update: Record<string, unknown> = {};
  if (parsed.data.name != null) update.name = parsed.data.name;
  if (parsed.data.durationHours != null) update.durationHours = parsed.data.durationHours;
  if (parsed.data.techPillar != null) update.techPillar = parsed.data.techPillar;
  if (parsed.data.businessBenefit != null) update.businessBenefit = parsed.data.businessBenefit;
  if (parsed.data.whatIsIt != null) update.whatIsIt = parsed.data.whatIsIt;
  if (parsed.data.whatDoesItSolve != null) update.whatDoesItSolve = parsed.data.whatDoesItSolve;

  const [row] = await db.update(offeringsTable).set(update).where(eq(offeringsTable.id, params.data.id)).returning();
  if (!row) { res.status(404).json({ error: "Offering not found" }); return; }

  res.json(formatOffering(row));
});

router.delete("/offerings/:id", async (req, res): Promise<void> => {
  const params = DeleteOfferingParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }

  const [row] = await db.delete(offeringsTable).where(eq(offeringsTable.id, params.data.id)).returning();
  if (!row) { res.status(404).json({ error: "Offering not found" }); return; }

  res.sendStatus(204);
});

// ─── Use Cases ────────────────────────────────────────────────────────────────

router.get("/use-cases", async (req, res): Promise<void> => {
  const parsed = ListUseCasesQueryParams.safeParse(req.query);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const { offeringId, industryType, search } = parsed.data;

  let rows = await db.select().from(useCasesTable).orderBy(useCasesTable.id);

  if (offeringId) {
    rows = rows.filter(r => r.offeringId === offeringId);
  }
  if (industryType) {
    rows = rows.filter(r => r.industryType.toLowerCase() === industryType.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    rows = rows.filter(r =>
      r.projectName.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q)
    );
  }

  res.json({ useCases: rows.map(formatUseCase) });
});

router.post("/use-cases", async (req, res): Promise<void> => {
  const parsed = CreateUseCaseBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const [row] = await db.insert(useCasesTable).values({
    offeringId: parsed.data.offeringId,
    companyIconUrl: parsed.data.companyIconUrl ?? null,
    projectName: parsed.data.projectName,
    industryType: parsed.data.industryType,
    description: parsed.data.description,
    previousState: parsed.data.previousState,
    newState: parsed.data.newState,
  }).returning();

  res.status(201).json(formatUseCase(row!));
});

router.get("/use-cases/:id", async (req, res): Promise<void> => {
  const params = GetUseCaseParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }

  const [row] = await db.select().from(useCasesTable).where(eq(useCasesTable.id, params.data.id));
  if (!row) { res.status(404).json({ error: "Use case not found" }); return; }

  res.json(formatUseCase(row));
});

router.put("/use-cases/:id", async (req, res): Promise<void> => {
  const params = UpdateUseCaseParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }

  const parsed = UpdateUseCaseBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const update: Record<string, unknown> = {};
  if (parsed.data.offeringId != null) update.offeringId = parsed.data.offeringId;
  if (parsed.data.projectName != null) update.projectName = parsed.data.projectName;
  if (parsed.data.industryType != null) update.industryType = parsed.data.industryType;
  if (parsed.data.description != null) update.description = parsed.data.description;
  if (parsed.data.previousState != null) update.previousState = parsed.data.previousState;
  if (parsed.data.newState != null) update.newState = parsed.data.newState;
  if ("companyIconUrl" in parsed.data) update.companyIconUrl = parsed.data.companyIconUrl;

  const [row] = await db.update(useCasesTable).set(update).where(eq(useCasesTable.id, params.data.id)).returning();
  if (!row) { res.status(404).json({ error: "Use case not found" }); return; }

  res.json(formatUseCase(row));
});

router.delete("/use-cases/:id", async (req, res): Promise<void> => {
  const params = DeleteUseCaseParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }

  const [row] = await db.delete(useCasesTable).where(eq(useCasesTable.id, params.data.id)).returning();
  if (!row) { res.status(404).json({ error: "Use case not found" }); return; }

  res.sendStatus(204);
});

// ─── Formatters ───────────────────────────────────────────────────────────────

function formatOffering(o: typeof offeringsTable.$inferSelect) {
  return {
    id: o.id,
    name: o.name,
    durationHours: o.durationHours,
    techPillar: o.techPillar,
    businessBenefit: o.businessBenefit,
    whatIsIt: o.whatIsIt,
    whatDoesItSolve: o.whatDoesItSolve,
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
  };
}

function formatUseCase(u: typeof useCasesTable.$inferSelect) {
  return {
    id: u.id,
    offeringId: u.offeringId,
    companyIconUrl: u.companyIconUrl ?? null,
    projectName: u.projectName,
    industryType: u.industryType,
    description: u.description,
    previousState: u.previousState,
    newState: u.newState,
    createdAt: u.createdAt.toISOString(),
    updatedAt: u.updatedAt.toISOString(),
  };
}

export default router;
