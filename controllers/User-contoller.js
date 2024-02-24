const User = require("../models/User")
const bcrypt = require("bcrypt");

module.exports = {
    createUser: async (req, res) => {
        const { nama, usia, email, password, confirmPassword, alamat, gender, telepon, tinggiBadan, beratBadan, family_history, kalori } = req.body;
        try {
            // cek email sudah terdaftar atau belum
            const cekEmail = await User.findOne({ email: email });
            if (cekEmail) {
                return res.status(400).json({
                    status: "Error",
                    message: "email sudah terdaftar",
                });
            }
            // enkripsi password
            const enkripPassword = await bcrypt.hash(password, 10);
            const enkripConfirmPassword = await bcrypt.hash(confirmPassword, 10);
            const user = await User.create(
                {
                    nama: nama,
                    usia: usia,
                    email: email,
                    password: enkripPassword,
                    confirmPassword: enkripConfirmPassword,
                    alamat: alamat,
                    gender: gender,
                    telepon: telepon,
                    tinggiBadan: tinggiBadan,
                    beratBadan: beratBadan,
                    family_history: family_history,
                    kaloriHarian: kalori
                }
            )
            res.status(201).json({
                status: "oke",
                message: "berhasil menambahkan user",
                data: user
            })
        } catch (error) {
            res.status(500).json({
                status: "Error",
                message: "gagal menambahkan data pasien baru",
                error: error.message,
            });
        }
    },
    getAllUser: async (req, res) => {
        try {
            const user = await User.find()
            res.status(201).json({
                status: "oke",
                message: "berhasil Ambil Data User",
                data: user
            })
        } catch (error) {
            res.status(500).json({
                status: "Error",
                message: "gagal mengambil semua data user",
                error: error.message,
            });
        }
    },
    getUserbyId: async (req, res) => {
        let { id } = req.params;
        try {
            const user = await User.findById(id)
            if (!user) {
                return res.status(404).json({
                    message: "id tidak ditemukan",
                });
            } else {
                res.status(201).json({
                    status: "oke",
                    message: "berhasil Ambil Data User berdasarkan id",
                    data: user
                })
            }
        } catch (error) {
            res.status(500).json({
                status: "Error",
                message: "gagal mengambil data user berdasarkan id",
                error: error.message,
            });
        }
    },
    editUser: async (req, res) => {
        let { id } = req.params;
        try {
            const user = await User.findByIdAndUpdate(id, req.body, { new: true })
            if (!user) {
                return res.status(404).json({
                    message: "id tidak ditemukan",
                });
            } else {
                res.status(201).json({
                    status: "oke",
                    message: "berhasil mengedit data user",
                    data: user
                })
            }
        } catch (error) {
            res.status(500).json({
                status: "Error",
                message: "gagal mengedit data user",
                error: error.message,
            });
        }
    },
    deleteUser: async (req, res) => {
        let { id } = req.params;
        try {
            const user = await User.findByIdAndDelete(id)
            if (!user) {
                return res.status(404).json({
                    message: "id tidak ditemukan",
                });
            } else {
                res.status(201).json({
                    status: "oke",
                    message: "berhasil menghapus data user",
                    data: user
                })
            }
        } catch (error) {
            res.status(500).json({
                status: "Error",
                message: "gagal menghapus data user",
                error: error.message,
            });
        }
    }
}