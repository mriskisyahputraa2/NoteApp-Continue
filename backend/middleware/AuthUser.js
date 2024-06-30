import User from "../models/UsersModel.js";

// verifyUser ketika user ketika login
export const verifyUser = async (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ msg: "Mohon login ke akun anda!" });
  }
  const user = await User.findOne({
    where: {
      uuid: req.session.userId,
    },
  });
  if (!user) {
    return res.status(404).json({ msg: "User tidak ditemukan" });
  }
  req.userId = user.id;
  req.role = user.role;
  next();
};

// function for check if your admin or not
export const adminOnly = async (req, res, next) => {
  const user = await User.findOne({
    where: {
      uuid: req.session.userId,
    },
  });

  // validasi jika user tidak ditemukan
  if (!user) {
    return res.status(404).json({ msg: "User tidak ditemukan" });
  }
  // validasi jika user bukan admin
  if (user.role !== "admin") {
    return res.status(403).json({ msg: "Akses terlarang, anda bukan admin" });
  }
  next(); // jika ya, maka next kehalaman selanjutnya
};
