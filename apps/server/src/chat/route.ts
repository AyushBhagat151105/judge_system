import { Router } from "express";
import { handleChat, handleGetHistory, handleGetEvaluation, handleDeleteEvaluation } from "./controller";
import validate from "@/lib/validation";
import { chatRequestSchema } from "./schema";

const router = Router();

router.post("/", validate(chatRequestSchema), handleChat);
router.get("/history", handleGetHistory);
router.get("/evaluation/:id", handleGetEvaluation);
router.delete("/evaluation/:id", handleDeleteEvaluation);

export default router;
