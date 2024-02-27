const mongoose = require('mongoose');

const MealPlanningSchema = new mongoose.Schema({
    IdUser : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    bahan: [String]
});

module.exports = mongoose.model('MealPlanning', MealPlanningSchema);
