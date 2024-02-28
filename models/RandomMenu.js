const mongoose = require('mongoose');


const RandomMenuSchema = new mongoose.Schema(
    {
        menus: [
            {
                day: {
                    type: String,
                    required: true
                },
                IdUser: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                },

            },
            {
                id_menu: {
                    type: String,
                    required: true
                },
                menu: {
                    type: String,
                    required: true
                },

            }
        ],


    }
)

const RandomMenu = mongoose.model("RandomMenu", RandomMenuSchema)
module.exports = RandomMenu