const mongoose = require('mongoose');

const BahanSchema = new mongoose.Schema({
    nama: String,
    jenis: String
});

const MealPlanningSchema = new mongoose.Schema({
    IdUser : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    bahan: [BahanSchema]
});

module.exports = mongoose.model('MealPlanning', MealPlanningSchema);
