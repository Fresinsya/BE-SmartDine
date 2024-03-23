const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");

module.exports = {
    createAdmin: async (req, res) => {
        const { nama, email, password, confirmPassword, alamat, gender, telepon } = req.body;
        try {
            // cek email sudah terdaftar atau belum
            const cekEmail = await Admin.findOne({ email: email });
            if (cekEmail) {
                return res.status(400).json({
                    status: "Error",
                    message: "email sudah terdaftar",
                });
            }
            // enkripsi password
            const enkripPassword = await bcrypt.hash(password, 10);
            const enkripConfirmPassword = await bcrypt.hash(confirmPassword, 10);
            const admin = await Admin.create(
                {
                    nama: nama,
                    email: email,
                    password: enkripPassword,
                    confirmPassword: enkripConfirmPassword,
                    alamat: alamat,
                    gender: gender,
                    telepon: telepon
                }
            )
            res.status(201).json({
                status: "oke",
                message: "berhasil menambahkan admin",
                data: admin
            })
        } catch (error) {
            res.status(500).json({
                status: "Error",
                message: "gagal menambahkan data admin baru",
                error: error.message,
            });
        }
    },
    getAllAdmin: async (req, res) => {
        try {
            const admin = await Admin.find()
            res.status(201).json({
                status: "oke",
                message: "berhasil Ambil Data Admin",
                data: admin
            })
        } catch (error) {
            res.status(500).json({
                status: "Error",
                message: "gagal mengambil semua data admin",
                error: error.message,
            });
        }
    },
    getAdminById: async (req, res) => {
        let { id } = req.params;
        try {
            const admin = await Admin.findById(id)
            if (!admin) {
                return res.status(404).json({
                    message: "id tidak ditemukan",
                });
            } else {
                res.status(201).json({
                    status: "oke",
                    message: "berhasil mengambil data admin",
                    data: admin
                })
            }
        } catch (error) {
            res.status(500).json({
                status: "Error",
                message: "gagal mengambil data admin",
                error: error.message,
            });
        }
    },
    editAdminById: async (req, res) => {
        let { id } = req.params;
        try {
            const admin = await Admin.findByIdAndUpdate(id, req.body, { new: true })
            if (!admin) {
                return res.status(404).json({
                    message: "id tidak ditemukan",
                });
            } else {
                res.status(201).json({
                    status: "oke",
                    message: "berhasil mengedit data admin",
                    data: admin
                })
            }
        } catch (error) {
            res.status(500).json({
                status: "Error",
                message: "gagal mengedit data admin",
                error: error.message,
            });
        }
    },
    deleteAdminById: async (req, res) => {
        let { id } = req.params;
        try {
            const admin = await Admin.findByIdAndDelete(id)
            if (!admin) {
                return res.status(404).json({
                    message: "id tidak ditemukan",
                });
            } else {
                res.status(201).json({
                    status: "oke",
                    message: "berhasil menghapus data admin",
                    data: admin
                })
            }
        } catch (error) {
            res.status(500).json({
                status: "Error",
                message: "gagal menghapus data admin",
                error: error.message,
            });
        }
    }

}