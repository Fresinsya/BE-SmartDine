const mongoose = require('mongoose');

const RekapKaloriSchema = new mongoose.Schema({
    tgl_input: {
        type: Date,
        default: Date.now
    },
    tgl_selesai: {
        type: Date,
        default: function() {
            const sevenDaysLater = new Date();
            sevenDaysLater.setDate(this.tgl_input.getDate() + 7);
            return sevenDaysLater;
        }
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
        required: true,
        default: 0
    },
    TDEE: {
        type: Number,
        required: true,
        default: 0
    },
    Defisit: {
        type: Number,
        required: true
    },
});

module.exports = mongoose.model('RekapKalori', RekapKaloriSchema);