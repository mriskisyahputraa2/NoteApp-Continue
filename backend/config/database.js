import { Sequelize } from "sequelize";

const db = new Sequelize("projekCoba", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;
