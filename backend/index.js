import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/database.js";
import SequelizeStore from "connect-session-sequelize";
import UserRoute from "./routes/UserRoute.js"; // Pastikan path ini benar
import AuthRoute from "./routes/AuthRoute.js";
import ProductRoute from "./routes/ProductRoute.js"; // Pastikan path ini benar
import BookRoute from "./routes/Books.js";

dotenv.config(); // Mengizinkan penggunaan variabel lingkungan dari file .env

const app = express(); // Inisialisasi express

// inisialisai database session dengan object dari database mysql
const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({
  db: db,
});

// Sinkronisasi database
// (async () => {
//   await db.sync();
// })();

// Middleware untuk session
app.use(
  session({
    secret: process.env.SESS_SECRET, // Digunakan untuk kunci rahasia ID session
    resave: false, // Mencegah session disimpan kembali ke storage jika tidak ada perubahan selama request
    store: store, // menyimpan session menggunakan instance store yang telah dibuat diatas. untuk menyimpan session di database melalui Sequelize.
    saveUninitialized: true, // Memaksa session yang baru, tapi tidak dimodifikasi, untuk disimpan ke storage
    cookie: {
      secure: "auto", // Mengatur cookie untuk digunakan pada koneksi HTTP/HTTPS secara otomatis
    },
  })
);

// Middleware untuk CORS
app.use(
  cors({
    credentials: true, // Mengizinkan cookie dan header otentikasi lain dikirim dalam permintaan lintas origin
    origin: "http://localhost:3000", // Mengizinkan permintaan dari origin http://localhost:3000
  })
);

// Middleware untuk parsing JSON
app.use(express.json());

// Middleware route
app.use(UserRoute);
app.use(ProductRoute);
app.use(BookRoute);
app.use(AuthRoute);

// Sinkronisasi database session
// store.sync();

// Menjalankan server pada port yang ditentukan dalam variabel lingkungan
app.listen(process.env.APP_PORT, () => {
  console.log("Server up and running...");
});
