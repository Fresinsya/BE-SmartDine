const mongoose = require('mongoose');

const BahanSchema = new mongoose.Schema({
    nama: String,
    jenis: String,
    jumlah: String
});

const MenuSchema = new mongoose.Schema(
    {
        menu: String,
        ingredients: [String],
        bahan: [BahanSchema],
        cara_masak: [String],
        kalori_makanan: Number,
        waktu_makan: [String],
        avatar: {
            type: String,
            default: "https://res.cloudinary.com/dd8tyaph2/image/upload/v1711198057/piring_gbndqt.jpg"
        },
        jenis_bahan: [String],
        berat_makanan: String,
        tgl_input: {
            type: Date,
            default: Date.now
        }

    }
)

const Menu = mongoose.model("Menu", MenuSchema)
module.exports = Menu