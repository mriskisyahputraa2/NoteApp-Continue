import { Sequelize } from "sequelize";
import db from "../config/database.js";
import User from "./UsersModel.js";

const { DataTypes } = Sequelize; // Objek yang berisi tipe data yang didukung oleh Sequelize. Ini digunakan untuk mendefinisikan tipe kolom dalam model.

// Mendefinisikan tabel model 'Users' ke database
const Product = db.define(
  "products",
  {
    // kolom uuid
    uuid: {
      type: DataTypes.STRING, // tipe data kolom ini adalah 'STRING'
      defaultValue: DataTypes.UUIDV4, // nilai default adalah uuid versi 4, yg merupakan id unik
      allowNull: false, // kolom tidak boleh 'null' / kosong
      // validasi
      validate: {
        notEmpty: true, // dimana kolonm tidak boleh kosong
      },
    },
    // kolom name
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 100], // panjang nama minimal 3 maksimal 100
      },
    },
    // kolom role
    price: {
      type: DataTypes.INTEGER, // type dari data kolom ini adalah 'INTEGER'
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    // kolom User ID
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    freezeTableName: true, // tidak boleh mengubah nama tabel menjadi bentuk jamak. tabel harus tetap 'products' dan tidak diubah menjadi 'productses'
  }
);

// Relasi antar tabel 'Users' dan 'Products'
User.hasMany(Product); // hasMany(user dapat memiliki banyak products) hubungan satu-ke-banyak dari pengguna ke produk
Product.belongsTo(User, { foreignKey: "userId" }); // belongsTo(products hanya terkait dengan satu users) kolom userId di tabel product sebagai foreign Key yg menguhubungkan setiap produk

export default Product;
