const mongoose = require('mongoose');

const RekapKaloriSchema = new mongoose.Schema({
    tgl: {
        type: Date,
        default: Date.now
    },
    IdUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    total_kalori_harian: {
        type: Number,
        required: true
    },
    BMR: {
        type: Number,
        required: true
    },
    TDEE: {
        type: Number,
        required: true
    },
    Defisit: {
        type: Number,
        required: true
    },
});

module.exports = mongoose.model('RekapKalori', RekapKaloriSchema);