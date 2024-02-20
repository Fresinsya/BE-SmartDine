const mongoose = require('mongoose');

const BahanSchema = new mongoose.Schema({
    nama: String,
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
            default: "https://i.stack.imgur.com/l60Hf.png"
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