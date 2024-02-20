const mongoose = require('mongoose');

const HistoryMakanSchema = new mongoose.Schema({
    tgl_mulai: {
        type: Date,
        default: Date.now
    },
    tgl_selesai: Date,
    id_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    id_menu: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu'
    },
    menus: [{
        menu: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'RandomMenu'
        },
    }]
});

// Pre-save hook untuk menghitung tanggal selesai (tgl_selesai) berdasarkan tanggal makan (tgl_mulai)
HistoryMakanSchema.pre('save', function(next) {
    let tgl_selesai = new Date(this.tgl_mulai);
    tgl_selesai.setDate(tgl_selesai.getDate() + 6); // Tambahkan 6 hari

    // Jika bulan selesai berbeda dengan bulan tanggal makan
    if (tgl_selesai.getMonth() !== this.tgl_mulai.getMonth()) {
        // Hitung sisa hari dalam bulan tanggal makan
        const sisaHari = new Date(this.tgl_mulai.getFullYear(), this.tgl_mulai.getMonth() + 1, 0).getDate() - this.tgl_mulai.getDate();
        // Tambahkan sisa hari ke tanggal selesai
        tgl_selesai.setDate(sisaHari + 1); // Ditambah 1 karena hari dimulai dari 1
    }

    this.tgl_selesai = tgl_selesai;
    next();
});

module.exports = mongoose.model('HistoryMakan', HistoryMakanSchema);
