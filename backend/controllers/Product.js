import Product from "../models/ProductModel.js";
import User from "../models/UsersModel.js";
import { Op } from "sequelize"; // import operator from Sequelize

// Function Get Product
export const getProducts = async (req, res) => {
  try {
    let response;
    if (req.role === "admin") {
      response = await Product.findAll({
        attributes: ["uuid", "name", "price"],
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    } else {
      response = await Product.findAll({
        attributes: ["uuid", "name", "price"],
        where: {
          userId: req.userId,
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

// function Get Product By Id
export const getProductById = async (req, res) => {
  try {
    // mendapatkan data product berdasarkan id
    const product = await Product.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    if (!product) return res.status(404).json({ msg: "Data tidak ditemukan" });

    let response;
    if (req.role === "admin") {
      response = await Product.findOne({
        attributes: ["uuid", "name", "price"],
        where: {
          id: product.id, // id nya berdasarkan dari produt id
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    } else {
      response = await Product.findOne({
        attributes: ["uuid", "name", "price"],
        where: {
          [Op.and]: [{ id: product.id }, { userId: req.userId }], // pengecekan use operator and, apakah product id sesuai dengan data product dan apakah user id sesuai dengan id user
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

// Function Create Product
export const createProduct = async (req, res) => {
  const { name, price } = req.body;
  try {
    await Product.create({
      name: name,
      price: price,
      userId: req.userId,
    });
    res.status(200).json({ msg: "Product created successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Function Update Product
export const updateProduct = async (req, res) => {
  try {
    // mendapatkan data product berdasarkan id
    const product = await Product.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    if (!product) return res.status(404).json({ msg: "Data tidak ditemukan" });

    // inisialisai name & price dari permintan body
    const { name, price } = req.body;
    if (req.role === "admin") {
      await Product.update(
        { name, price },
        {
          where: {
            id: product.id,
          },
        }
      );
      //  jika yang yang klik bukan admin tetapi user
    } else {
      // cek validasi apakah pengguna itu user atau bukan
      if (req.userId !== product.userId)
        return res
          .status(403)
          .json({ msg: "Akses terlarang, anda bukan admin" });

      await Product.update(
        { name, price },
        {
          where: {
            [Op.and]: [{ id: product.id }, { userId: req.userId }],
          },
        }
      );
    }
    res.status(200).json({ msg: "Product updated successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// function Delete Product
export const deleteProduct = async (req, res) => {
  try {
    // mendapatkan data product berdasarkan id
    const product = await Product.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    if (!product) return res.status(404).json({ msg: "Data tidak ditemukan" });

    // inisialisai name & price dari permintan body
    if (req.role === "admin") {
      await Product.destroy({
        where: {
          id: product.id,
        },
      });
      //  jika yang yang klik bukan admin tetapi user
    } else {
      // cek validasi apakah pengguna itu user atau bukan
      if (req.userId !== product.userId)
        return res
          .status(403)
          .json({ msg: "Akses terlarang, anda bukan admin" });

      await Product.destroy({
        where: {
          [Op.and]: [{ id: product.id }, { userId: req.userId }],
        },
      });
    }
    res.status(200).json({ msg: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
