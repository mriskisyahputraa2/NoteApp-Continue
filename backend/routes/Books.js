import express from "express";
import {
  getBooks,
  getBooksById,
  createBooks,
  updateBooks,
  deleteBooks,
} from "../controllers/Books.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/books", verifyUser, getBooks);
router.get("/books/:id", verifyUser, getBooksById);
router.post("/books", verifyUser, createBooks);
router.patch("/books/:id", verifyUser, updateBooks);
router.delete("/books/:id", verifyUser, deleteBooks);

export default router;
