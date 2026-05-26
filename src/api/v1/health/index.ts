import { Router } from "express";
import { getQueueHealth } from "./controllers/queueHealthControllers";


const router = Router();

router.get("/queue", getQueueHealth);

export default router;
