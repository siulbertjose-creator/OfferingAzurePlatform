import { Router, type IRouter } from "express";
import healthRouter from "./health";
import successCasesRouter from "./successCases";
import offeringsRouter from "./offerings";
import adminRouter from "./admin";
import storageRouter from "./storage";

const router: IRouter = Router();

router.use(healthRouter);
router.use(storageRouter);
router.use(offeringsRouter);
router.use(successCasesRouter);
router.use(adminRouter);

export default router;
