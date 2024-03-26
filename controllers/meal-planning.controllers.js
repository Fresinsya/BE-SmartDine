const Meal_planning = require("../models/Meal_planning");

module.exports = {
    getAllMealPlanning: async (req, res) => {
        try {
            const mealPlanning = await Meal_planning.find();
            res.status(200).json({
                status: "oke",
                message: "berhasil mendapatkan data",
                data: mealPlanning,
            });
        } catch (error) {
            res.status(500).json({
                status: "Error",
                message: "gagal mendapatkan data",
                error: error.message,
            });
        }
    },
    getMealPlanningbyId: async (req, res) => {
        const id = req.params.id;
        try {
            const bahan = await Meal_planning.findOne({
                IdUser: id
            });
            if (!bahan) {
                return res.status(404).json({
                    message: "id tidak ditemukan",
                });
            }
            res.status(200).json({
                status: "oke",
                message: "berhasil mendapatkan data",
                data: bahan,
            });
        } catch (error) {
            res.status(500).json({
                status: "Error",
                message: "gagal mendapatkan data",
                error: error.message,
            });
        }
    },
    createMealPlanning: async (req, res) => {
        const { IdUser, bahan } = req.body;
        try {
            // Dapatkan dokumen MealPlanning berdasarkan IdUser
            let mealPlanning = await Meal_planning.findOne({ IdUser });
    
            if (!mealPlanning) {
                // Jika tidak ada MealPlanning untuk IdUser ini, Anda dapat membuatnya
                const newMealPlanning = new Meal_planning({
                    IdUser,
                    bahan: bahan.map(item => ({
                        nama: item.nama,
                        jenis: item.jenis
                    })) // Menggunakan bahan langsung
                });
                // Simpan dokumen MealPlanning baru
                mealPlanning = await newMealPlanning.save();
            } else {
                // Filter bahan yang sudah ada dalam meal planning
                const uniqueBahan = bahan.filter(newItem => !mealPlanning.bahan.some(existingItem => existingItem.nama === newItem.nama));
                
                // Tambahkan bahan baru ke dalam array bahan yang ada
                mealPlanning.bahan = mealPlanning.bahan.concat(uniqueBahan);
    
                // Simpan perubahan pada dokumen MealPlanning yang ada
                mealPlanning = await mealPlanning.save();
            }
    
            res.status(201).json({
                status: "success",
                message: "berhasil menambahkan bahan",
                data: mealPlanning
            });
        } catch (error) {
            res.status(500).json({
                status: "error",
                message: "gagal menambahkan bahan",
                error: error.message
            });
        }
    },    
    deleteMealPlanning: async (req, res) => {
        const { id } = req.params;
        try {
            const mealPlanning = await Meal_planning.deleteMany({ IdUser: id});
            if (!mealPlanning) {
                return res.status(404).json({
                    message: "id tidak ditemukan",
                });
            }
            res.status(200).json({
                status: "oke",
                message: "berhasil menghapus data",
            });
        } catch (error) {
            res.status(500).json({
                status: "Error",
                message: "gagal menghapus data",
                error: error.message,
            });
        }
    },
    deleteBahan: async (req, res) => {
        const { id, bahanId } = req.params;
        try {
            const mealPlanning = await Meal_planning.findOneAndUpdate(
                { IdUser: id },
                { $pull: { bahan: { _id: bahanId } } },
                { new: true }
            );
    
            if (!mealPlanning) {
                return res.status(404).json({
                    message: "id tidak ditemukan",
                });
            }
    
            res.status(200).json({
                status: "oke",
                message: "berhasil menghapus bahan",
                data: mealPlanning
            });
        } catch (error) {
            res.status(500).json({
                status: "Error",
                message: "gagal menghapus bahan",
                error: error.message,
            });
        }
    },

}