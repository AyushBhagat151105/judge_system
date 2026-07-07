import { auth } from "@judge_system/auth";
import { env } from "@judge_system/env/server";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
import chatRouter from "./chat/route";
import globalErrorHandler from "./lib/errorHandler";

const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.all("/api/auth{/*path}", toNodeHandler(auth));

app.use(express.json());

app.use("/api/v1/chat", chatRouter);

app.get("/", (_req, res) => {
  res.status(200).send("OK");
});

app.use(globalErrorHandler);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
