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
            const mealPlanning = await Meal_planning.findById(id);
            if (!mealPlanning) {
                return res.status(404).json({
                    message: "id tidak ditemukan",
                });
            }
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
    createMealPlanning: async (req, res) => {
        const { IdUser, bahan } = req.body;
        try {
            // Dapatkan dokumen MealPlanning berdasarkan IdUser
            const mealPlanning = await Meal_planning.findOne({ IdUser });
    
            if (!mealPlanning) {
                // Jika tidak ada MealPlanning untuk IdUser ini, Anda dapat membuatnya
                const newMealPlanning = new Meal_planning({
                    IdUser,
                    bahan: bahan // Menggunakan bahan langsung
                });
                // Simpan dokumen MealPlanning baru
                await newMealPlanning.save();
            } else {
                // Jika sudah ada MealPlanning, tambahkan bahan baru ke dalam array bahan yang ada
                mealPlanning.bahan = mealPlanning.bahan.concat(bahan);
                // Simpan perubahan pada dokumen MealPlanning yang ada
                await mealPlanning.save();
            }
    
            res.status(201).json({
                status: "oke",
                message: "berhasil menambahkan bahan",
                data: mealPlanning
            });
        } catch (error) {
            res.status(500).json({
                status: "Error",
                message: "gagal menambahkan bahan",
                error: error.message,
            });
        }
    }
}