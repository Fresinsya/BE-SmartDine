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
            const newMealPlanning = await Meal_planning.create({
                IdUser: IdUser,
                bahan: bahan,
            });
            res.status(201).json({
                status: "oke",
                message: "berhasil menambahkan data meal planning",
                data: newMealPlanning,
            });
        } catch (error) {
            res.status(500).json({
                status: "Error",
                message: "gagal menambahkan data meal planning",
                error: error.message,
            });
        }
    }
}