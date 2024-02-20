const Riwayat = require("../models/Riwayat");

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
        const { FACV, FCVC, NCP, CAEC, CH20, SCC, FAF, TUE, CALC, MTRANS, NObeyesdad } = req.body;
        try {
            const riwayat = await Riwayat.create({
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
    deleteRiwayat : async (req, res) => {
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
    }
}