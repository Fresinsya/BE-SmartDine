const mongoose = require('mongoose');

const RandomMenuSchema = new mongoose.Schema(
    {
        menu: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Menu'
        },
        // menu_history: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'HistoryMakan'
        // },
        day : Number
    }
)

const RandomMenu = mongoose.model("RandomMenu", RandomMenuSchema)
module.exports = RandomMenu