import Todo from "../models/Todo.js";
import mongoose from "mongoose";

/**
 * Create todo (POST /api/todos)
 * This endpoint creates a new todo item for the authenticated user.
 */
export const createTodo = async (req, res, next) => {
  try {
    // Ensure the user is authenticated
    if (!req.user) return res.status(401).json({ message: "Authentication required" });

    const { title, description, completed } = req.body || {};

    // Validation
    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title is required" });
    }

    if (title.length > 200) {
      return res.status(400).json({ message: "Title cannot exceed 200 characters" });
    }

    if (description && description.length > 1000) {
      return res.status(400).json({ message: "Description cannot exceed 1000 characters" });
    }

    const todo = await Todo.create({
      title: title.trim(),
      description: description ? description.trim() : "",
      completed: !!completed,
      user: req.user
    });

    return res.status(201).json({
      id: todo._id,
      title: todo.title,
      description: todo.description,
      completed: todo.completed,
      createdAt: todo.createdAt
    });
  } catch (err) {
    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    next(err);
  }
};

/**
 * Get todos (GET /api/todos?page=&limit=&search=&sort=&order=)
 * - pagination
 * - optional search by title
 * - optional sort: field and order
 */
export const getTodos = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const limit = Math.max(1, parseInt(req.query.limit || "10", 10));
    const search = req.query.search ? String(req.query.search).trim() : null;

    // sorting
    const sortField = req.query.sort || "createdAt";
    const order = (req.query.order || "desc").toLowerCase() === "asc" ? 1 : -1;
    const sort = { [sortField]: order };

    const filter = { user: req.user };
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const total = await Todo.countDocuments(filter);

    const todos = await Todo.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const data = todos.map(t => ({
      id: t._id,
      title: t.title,
      description: t.description,
      completed: t.completed,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt
    }));

    return res.json({ data, page, limit, total });
  } catch (err) {
    next(err);
  }
};

/**
 * Update a todo item (PUT /api/todos/:id)
 * Updates the specified todo item for the authenticated user by ID, allowing changes to title, description, and completed status.
 */
export const updateTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID" });

    const todo = await Todo.findById(id);
    if (!todo) return res.status(404).json({ message: "Not found" });

    if (String(todo.user) !== String(req.user)) return res.status(403).json({ message: "Forbidden" });

    const { title, description, completed } = req.body || {};

    // Validation
    if (title !== undefined) {
      if (!title || title.trim() === "") {
        return res.status(400).json({ message: "Title cannot be empty" });
      }
      if (title.length > 200) {
        return res.status(400).json({ message: "Title cannot exceed 200 characters" });
      }
      todo.title = title.trim();
    }

    if (description !== undefined) {
      if (description && description.length > 1000) {
        return res.status(400).json({ message: "Description cannot exceed 1000 characters" });
      }
      todo.description = description.trim();
    }

    if (completed !== undefined) todo.completed = !!completed;

    await todo.save();

    return res.json({
      id: todo._id,
      title: todo.title,
      description: todo.description,
      completed: todo.completed,
      updatedAt: todo.updatedAt
    });
  } catch (err) {
    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    next(err);
  }
};

/**
 * Deletes a todo item by ID for the authenticated user (DELETE /api/todos/:id)
 * This endpoint deletes the specified todo item for the authenticated user.
 */
export const deleteTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID" });

    const todo = await Todo.findById(id);
    if (!todo) return res.status(404).json({ message: "Not found" });

    if (String(todo.user) !== String(req.user)) return res.status(403).json({ message: "Forbidden" });

    await todo.remove();
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};
