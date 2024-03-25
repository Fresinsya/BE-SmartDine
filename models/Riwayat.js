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
        tgl_selesai: {
            type: Date,
            default: function() {
                const sevenDaysLater = new Date();
                sevenDaysLater.setDate(this.tgl_input.getDate() + 7);
                return sevenDaysLater;
            }
        },
        IdUser : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    }
)

const Riwayat = mongoose.model("Riwayat", RiwayatSkema)
module.exports = Riwayat