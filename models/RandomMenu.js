const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
    day: {
        type: String,
        required: true
    },
    jenis: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    id_menu: {
        type: String,
        required: true
    },
    menu: {
        type: String,
        required: true
    },
    berat_modif: {
        type: String,
        required: true
    },
    kalori_modif: {
        type: String,
        required: true
    }
});



const RandomMenuSchema = new mongoose.Schema({
    IdUser: {
        type: mongoose.Schema.Types.ObjectId, // Menggunakan ObjectId untuk IdUser
        ref: 'User', // Referensi ke skema User jika digunakan
        required: true
    },
    menus: [[MenuSchema]],
    date: {
        type: Date,
        default: Date.now
    },
    date_selesai: Date
});

RandomMenuSchema.pre('save', function (next) {
    let date_selesai = new Date(this.date);
    date_selesai.setDate(date_selesai.getDate() + 6); // Tambahkan 6 hari

    // Jika bulan selesai berbeda dengan bulan tanggal makan
    if (date_selesai.getMonth() !== this.date.getMonth()) {
        // Hitung sisa hari dalam bulan tanggal makan
        const sisaHari = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDate() - this.date.getDate();
        // Tambahkan sisa hari ke tanggal selesai
        date_selesai.setDate(sisaHari + 1); // Ditambah 1 karena hari dimulai dari 1
    }

    this.date_selesai = date_selesai;
    next();
});


const RandomMenuModel = mongoose.model('RandomMenu', RandomMenuSchema);

module.exports = RandomMenuModel;