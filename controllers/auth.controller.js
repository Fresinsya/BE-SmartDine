const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    return jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_Key
    );
  };

module.exports = {
    login: async (req, res) => {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email: email });
            if (!user) {
                return res.status(400).json({
                    status: "Error",
                    message: "Email tidak terdaftar",
                });
            }

            const cekPassword = await bcrypt.compare(password, user.password);
            if (!cekPassword) {
                return res.status(400).json({
                    status: "Error",
                    message: "Password salah",
                });
            }

            // Jika email dan password valid, hasilkan token JWT
            const token = generateToken(user);

            res.status(200).json({
                status: "OK",
                message: "Berhasil login",
                id: user.id,
                email: user.email,
                token: token,
            });
        } catch (error) {
            res.status(500).json({
                status: "Error",
                message: "Gagal login",
                error: error.message,
            });
        }
    },
    register: async (req, res) => {
        const { nama, email, password, confirmPassword } = req.body;
        try {
            const cekEmail = await User.findOne({ email: email });
            if (cekEmail) {
                return res.status(400).json({
                    status: "Error",
                    message: "Email sudah terdaftar",
                });
            }
    
            // Pengecekan konsistensi password
            if (password !== confirmPassword) {
                return res.status(400).json({
                    status: "Error",
                    message: "Konfirmasi password tidak sesuai",
                });
            }
    
            // Enkripsi password
            const enkripPassword = await bcrypt.hash(password, 10);
            const enkripConfirmPassword = await bcrypt.hash(confirmPassword, 10);
    
            // Buat user baru
            const user = await User.create({
                nama: nama,
                email: email,
                password: enkripPassword,
                confirmPassword: enkripConfirmPassword,
            });
    
            // Tanggapan berhasil
            res.status(201).json({
                status: "OK",
                message: "Berhasil menambahkan user",
                data: user
            });
        } catch (error) {
            // Tanggapan kesalahan
            res.status(500).json({
                status: "Error",
                message: "Gagal menambahkan user",
                error: error.message,
            });
        }
    }
    

}