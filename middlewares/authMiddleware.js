import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

export const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader || null;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // attach user id to req.user
        req.user = decoded.id;
        // optionally fetch user
        req.userDoc = await User.findById(req.user).select("-password");
        if (!req.userDoc) return res.status(401).json({ message: "Unauthorized" });
        next();
    } catch (err) {
        console.error("JWT verification error:", err);
        return res.status(401).json({ message: "Invalid token" });
    }
};
