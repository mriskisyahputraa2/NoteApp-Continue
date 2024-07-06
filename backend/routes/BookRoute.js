import express from "express";
import {
  getBooks,
  getBooksById,
  createBooks,
  updateBooks,
  deleteBooks,
  extendDeadline,
} from "../controllers/Books.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js"; // Impor adminOnly

const router = express.Router();

router.get("/books", verifyUser, getBooks);
router.get("/books/:id", verifyUser, getBooksById);
router.post("/books", verifyUser, createBooks);
router.patch("/books/:id", verifyUser, updateBooks);
router.delete("/books/:id", verifyUser, deleteBooks);

// Rute untuk memperpanjang deadline, hanya admin yang bisa mengakses
router.put("/books/extend/:id", verifyUser, adminOnly, extendDeadline);

export default router;
