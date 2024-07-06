import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize; // Objek yang berisi tipe data yang didukung oleh Sequelize. Ini digunakan untuk mendefinisikan tipe kolom dalam model.

// Mendefinisikan tabel model 'Users' ke database
const User = db.define(
  "users",
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
    // kolom email
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true, // email wajib isi
      },
    },
    // kolom password
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    // kolom role
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    freezeTableName: true, // tidak boleh mengubah nama tabel menjadi bentuk jamak. tabel harus tetap 'users' dan tidak diubah menjadi 'userses'
  }
);

export default User;
