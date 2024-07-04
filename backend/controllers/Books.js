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

  // Validasi apakah semua input yang diperlukan telah diisi
  if (!name || !genre || !deadline) {
    return res
      .status(400)
      .json({ msg: "Mohon masukkan datanya terlebih dahulu" });
  }

  const deadlineDate = new Date(deadline);

  // Validasi apakah deadline adalah tanggal yang valid
  if (isNaN(deadlineDate)) {
    return res
      .status(400)
      .json({ msg: "Tanggal yang kamu masukkan tidak valid" });
  }

  const maxDeadlineDate = new Date();
  maxDeadlineDate.setDate(maxDeadlineDate.getDate() + 30);

  // Validasi apakah deadline melebihi 30 hari dari hari ini
  if (deadlineDate > maxDeadlineDate) {
    return res.status(400).json({
      msg: "Batas waktu tidak boleh lebih dari 30 hari dari hari ini",
    });
  }

  try {
    await Book.create({
      name: name,
      genre: genre,
      deadline: deadlineDate,
      userId: req.userId,
    });
    res.status(200).json({ msg: "Buku berhasil ditambahkan" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateBooks = async (req, res) => {
  try {
    // Mencari buku berdasarkan UUID yang diberikan di parameter URL
    const book = await Book.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    // Jika buku tidak ditemukan, kirimkan respons status 404 dengan pesan error
    if (!book) return res.status(404).json({ msg: "Data tidak ditemukan" });

    // Mengambil data name, genre, dan deadline dari body request
    const { name, genre, deadline } = req.body;
    const deadlineDate = new Date(deadline);

    // Validasi jika deadline yang diberikan bukan tanggal yang valid
    if (isNaN(deadlineDate)) {
      return res
        .status(400)
        .json({ msg: "Tanggal yang kamu masukkan tidak valid" });
    }

    // Membuat objek tanggal hari ini
    const today = new Date();

    // Validasi jika deadline yang diberikan adalah tanggal yang sudah lewat
    if (deadlineDate < today) {
      return res
        .status(400)
        .json({ msg: "Tanggal yang kamu masukkan sudah lewat" });
    }

    if (req.role === "admin") {
      await Book.update(
        { name, genre, deadline: deadlineDate },
        {
          where: {
            id: book.id,
          },
        }
      );
    } else {
      if (req.userId !== book.userId) {
        return res
          .status(403)
          .json({ msg: "Akses terlarang, anda bukan admin" });
      }

      await Book.update(
        { name, genre, deadline: deadlineDate },
        {
          where: {
            [Op.and]: [{ id: book.id }, { userId: req.userId }],
          },
        }
      );
    }
    res.status(200).json({ msg: "Buku berhasil diupdate" });
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
    res.status(200).json({ msg: "Product berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const extendDeadline = async (req, res) => {
  const { bookId, newDeadline } = req.body;

  if (req.role !== "admin") {
    return res.status(403).json({ msg: "Akses dilarang: Hanya Admin" });
  }

  const newDeadlineDate = new Date(newDeadline);

  if (isNaN(newDeadlineDate)) {
    return res
      .status(400)
      .json({ msg: "Tanggal yang kamu masukkan tidak valid" });
  }

  try {
    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ msg: "Buku tidak ditemukan" });
    }

    book.deadline = newDeadlineDate;
    await book.save();

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
