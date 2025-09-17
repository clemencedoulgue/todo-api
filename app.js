import express from "express";
import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";

const app = express();

app.use(express.json());

// health
app.get("/", (req, res) => res.json({ message: "Todo API is running" }));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

// 404 + error handler
app.use(notFound);
app.use(errorHandler);

export default app;
