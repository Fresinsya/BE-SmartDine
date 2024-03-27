const RekapKalori = require("../models/RekapKalori");

module.exports = {
    getAllRekapKalori: async (req, res) => {
        try {
            const rekapKalori = await RekapKalori.find();
            res.status(200).json({
                status: "oke",
                message: "berhasil mendapatkan data",
                data: rekapKalori,
            });
        } catch (error) {
            res.status(500).json({
                status: "Error",
                message: "gagal mendapatkan data",
                error: error.message,
            });
        }
    },
    getRekapbyIdUser: async (req, res) => {
        const id = req.params.id;
        try {
            const rekapKalori = await RekapKalori.find({IdUser : id});
            res.status(200).json({
                status: "oke",
                message: "berhasil mendapatkan data",
                data: rekapKalori,
            });
        } catch (error) {
            res.status(500).json({
                status: "Error",
                message: "gagal mendapatkan data",
                error: error.message,
            });
        }
    },
    deleteByIDUser: async (req, res) => {
        const id = req.params.id;
        try {
            const rekapKalori = await RekapKalori.findOneAndDelete({IdUser : id});
            res.status(200).json({
                status: "oke",
                message: "berhasil menghapus data",
                data: rekapKalori,
            });
        } catch (error) {
            res.status(500).json({
                status: "Error",
                message: "gagal menghapus data",
                error: error.message,
            });
        }
    },
}