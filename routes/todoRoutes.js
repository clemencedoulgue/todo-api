import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { createTodo, getTodos, updateTodo, deleteTodo } from "../controllers/todoController.js";

const router = express.Router();

// All routes protected
router.use(protect);

// POST /api/todos
router.post("/", createTodo);

// GET /api/todos?page=1&limit=10&search=&sort=&order=
router.get("/", getTodos);

// PUT /api/todos/:id
router.put("/:id", updateTodo);

// DELETE /api/todos/:id
router.delete("/:id", deleteTodo);

export default router;
