import Book from "../models/Books.js";
import User from "../models/UsersModel.js";
import { Op } from "sequelize"; // import operator from Sequelize

export const getBooks = async (req, res) => {
  try {
    let response;
    if (req.role == "admin") {
      response = await Book.findAll({
        attributes: ["uuid", "name", "genre", "deadline"],
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    } else {
      response = await Book.findAll({
        attributes: ["uuid", "name", "genre", "deadline"],
        where: {
          userId: req.userId,
        },
        where: {
          model: User,
          attributes: ["name", "email"],
        },
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getBooksById = async (req, res) => {
  try {
    const book = await Book.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    if (!book) return res.status(404).json({ msg: "Data tidak ditemukan" });

    let response;
    if (role.role === "admin") {
      response = await Book.findOne({
        attributes: ["uuid", "name", "genre", "deadline"],
        where: {
          id: book.id,
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    } else {
      response = await Book.findOne({
        attributes: ["uuid", "name", "genre", "deadline"],
        where: {
          [Op.and]: [{ id: book.id }, { userId: req.userId }],
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createBooks = async (req, res) => {
  const { name, genre, deadline } = req.body;
  try {
    await Book.create({
      name: name,
      genre: genre,
      deadline: deadline,
      userId: req.userId,
    });
    res.status(200).json({ msg: "Book created successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateBooks = (req, res) => {};

export const deleteBooks = (req, res) => {};
