const Riwayat = require("../models/Riwayat");
const User = require("../models/User");

module.exports = {
    getAllRiwayat: async (req, res) => {
        try {
            const riwayat = await Riwayat.find();
            res.status(200).json({
                status: "oke",
                message: "berhasil mendapatkan data",
                data: riwayat,
            });
        } catch (error) {
            res.status(500).json({
                status: "Error",
                message: "gagal mendapatkan data",
                error: error.message,
            });
        }
    },
    createRiwayat: async (req, res) => {
        const { IdUser, FACV, FCVC, NCP, CAEC, CH20, SCC, FAF, TUE, CALC, MTRANS, NObeyesdad } = req.body;
        try {
            const user = await User.findOne({ _id: IdUser });
            if (!user) {
                return res.status(404).json({
                    status: "Error",
                    message: "User tidak ditemukan",
                });
            }

            // Lakukan pengecekan data user
            if (!user.usia || !user.gender || !user.tinggiBadan || !user.beratBadan || (user.family_history === undefined || user.family_history === null)) {
                return res.status(400).json({
                    status: "Error",
                    message: "Data user tidak lengkap",
                });
            }

            const riwayat = await Riwayat.create({
                IdUser: IdUser,
                FACV: FACV,
                FCVC: FCVC,
                NCP: NCP,
                CAEC: CAEC,
                CH20: CH20,
                SCC: SCC,
                FAF: FAF,
                TUE: TUE,
                CALC: CALC,
                MTRANS: MTRANS,
                NObeyesdad: NObeyesdad,
            });
            res.status(201).json({
                status: "oke",
                message: "berhasil menambahkan data kebisaan",
                data: riwayat
            },
            );
        } catch (error) {
            res.status(500).json({
                status: "Error",
                message: "gagal menambahkan data kebiasaan",
                error: error.message,
            });
        }
    },
    getRiwayatbyId: async (req, res) => {
        const id = req.params.id;
        try {
            const riwayat = await Riwayat.findById(id);
            res.status(200).json({
                status: "oke",
                message: "berhasil mendapatkan data",
                data: riwayat,
            });
        } catch (error) {
            res.status(500).json({
                status: "Error",
                message: "gagal mendapatkan data",
                error: error.message,
            });
        }
    },
    getRiwayatByIdUser: async (req, res) => {
        const id = req.params.id;
        try {
            const riwayat = await Riwayat.findOne({
                IdUser: id
            });
            res.status(200).json({
                status: "oke",
                message: "berhasil mendapatkan data riwayat by user id",
                data: riwayat,
            });
        } catch (error) {
            res.status(500).json({
                status: "Error",
                message: "gagal mendapatkan data",
                error: error.message,
            });
        }
    },
    editRiwayat: async (req, res) => {
        const { id } = req.params;
        try {
            const riwayat = await Riwayat.findByIdAndUpdate(id, req.body, { new: true })
            if (!riwayat) {
                return res.status(404).json({
                    message: "id tidak ditemukan",
                });
            } else {
                res.status(200).json({
                    status: "oke",
                    message: "berhasil mengubah data",
                    data: riwayat,
                })
            }
        } catch (error) {
            res.status(500).json({
                status: "Error",
                message: "gagal mengubah data",
                error: error.message,
            });
        }
    },
    editRiwayatiduser: async (req, res) => {
        const { id } = req.params;
        try {
            const riwayat = await Riwayat.findOne({ IdUser: id });
            if (!riwayat) {
                return res.status(404).json({
                    message: "Id tidak ditemukan",
                });
            }

            const today = new Date();
            const tglUpdate = today.setDate(today.getDate() + 7);
            
            // Dapatkan tgl_input dari riwayat
            const tglInput = riwayat.tgl_input;
            const tglSelesai = riwayat.tgl_selesai;
            console.log(tglInput, tglSelesai)
    
            // Hitung perbedaan waktu antara tgl_input dan tanggal saat ini
            const diffInTime = new Date().getTime() - tglSelesai.getTime();
            const diffInDays = diffInTime / (1000 * 3600 * 24); // Konversi dari milidetik ke hari
    
            console.log(diffInDays)
            // Jika perbedaan waktu lebih dari 7 hari, izinkan pengeditan
            if (diffInDays >= 0) {
                const riwayatUpdated = await Riwayat.findOneAndUpdate(
                    { IdUser: id },
                    {...req.body, tgl_input: new Date(), tgl_selesai: tglUpdate},
                    { new: true }
                );
    
                res.status(200).json({
                    status: "OK",
                    message: "Berhasil mengubah data",
                    data: riwayatUpdated,
                });
            } else {
                // Jika perbedaan waktu kurang dari 7 hari, kembalikan pesan kesalahan
                res.status(403).json({
                    status: "Error",
                    message: "Edit riwayat hanya bisa dilakukan setelah 7 hari dari tanggal input.",
                });
            }
        } catch (error) {
            res.status(500).json({
                status: "Error",
                message: "Gagal mengubah data",
                error: error.message,
            });
        }
    },
    deleteRiwayat: async (req, res) => {
        const { id } = req.params;
        try {
            const riwayat = await Riwayat.findByIdAndDelete(id);
            if (!riwayat) {
                return res.status(404).json({
                    message: "id tidak ditemukan",
                });
            } else {
                res.status(200).json({
                    status: "oke",
                    message: "berhasil menghapus data",
                    data: riwayat,
                })
            }
        } catch (error) {
            res.status(500).json({
                status: "Error",
                message: "gagal menghapus data",
                error: error.message,
            });
        }
    },
    deleteByIdUser: async (req, res) => {
        const { id } = req.params;
        try {
            const riwayat = await Riwayat.findOneAndDelete({ IdUser: id });
            if (!riwayat) {
                return res.status(404).json({
                    message: "id tidak ditemukan",
                });
            } else {
                res.status(200).json({
                    status: "oke",
                    message: "berhasil menghapus data",
                    data: riwayat,
                })
            }
        } catch (error) {
            res.status(500).json({
                status: "Error",
                message: "gagal menghapus data",
                error: error.message,
            });
        }
    },
}