import Book from "../models/Books.js";
import User from "../models/UsersModel.js";
import { Op, where } from "sequelize"; // import operator from Sequelize

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
        include: {
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
    if (req.role === "admin") {
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

export const updateBooks = async (req, res) => {
  try {
    const book = await Book.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    // jika data buku tidak ditemukan
    if (!book) return res.status(404).json({ msg: "Data tidak ditemukan" });

    const { name, genre, deadline } = req.body;

    // jika role pengguna adalah admin
    if (req.role === "admin") {
      await Book.update(
        { name, genre, deadline },
        {
          where: {
            id: book.id,
          },
        }
      );
    } else {
      // jika pengguna bukan lah admin
      if (req.userId !== book.userId) {
        return res
          .status(403)
          .json({ msg: "Akses terlarang, anda bukan admin" });
      }

      await Book.update(
        { name, genre, deadline },
        {
          where: {
            [Op.and]: [{ id: book.id }, { userId: req.userId }],
          },
        }
      );
    }
    res.status(200).json({ msg: "Book updated successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteBooks = async (req, res) => {
  try {
    const book = await Book.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    if (!book) return res.status(404).json({ msg: "Data tidak ditemukan" });

    if (req.role === "admin") {
      await Book.destroy({
        where: {
          id: book.id,
        },
      });
    } else {
      if (req.userId !== book.userId) {
        return res
          .status(403)
          .json({ msg: "Akses terlarang, anda bukan admin" });
      }

      await Book.destroy({
        where: {
          [Op.and]: [{ id: book.id }, { userId: req.userId }],
        },
      });
    }
    res.status(200).json({ msg: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
