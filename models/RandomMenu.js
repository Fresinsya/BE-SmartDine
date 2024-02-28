const mongoose = require('mongoose');

const RandomMenuSchema = new mongoose.Schema(
    {
        IdUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        menus: {
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