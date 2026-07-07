import { Router } from "express";
import { handleChat } from "./controller";
import validate from "@/lib/validation";
import { chatRequestSchema } from "./schema";

const router = Router();

router.post("/", validate(chatRequestSchema), handleChat);

export default router;
