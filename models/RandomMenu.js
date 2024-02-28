const mongoose = require('mongoose');


const RandomMenuSchema = new mongoose.Schema(
    {
        IdUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        day: {
            type: String,
            required: true
        },
        menus: [
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