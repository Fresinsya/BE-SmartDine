const mongoose = require('mongoose');

const RiwayatSkema = new mongoose.Schema(
    {
        FACV : Number,
        FCVC : Number,
        NCP : Number,
        CAEC : Number,
        CH20 : Number,
        SCC : Number,
        FAF : Number,
        TUE : Number,
        CALC : Number,
        MTRANS : Number,
        NObeyesdad : String,
        BMR: Number,
        TDEE: Number,
        tgl_input : {
            type: Date,
            default: Date.now
        },
        IdUser : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    }
)

const Riwayat = mongoose.model("Riwayat", RiwayatSkema)
module.exports = Riwayat