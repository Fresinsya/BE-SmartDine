const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
    day: {
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
    }
});

const RandomMenuSchema = new mongoose.Schema({
    IdUser: {
        type: mongoose.Schema.Types.ObjectId, // Menggunakan ObjectId untuk IdUser
        ref: 'User', // Referensi ke skema User jika digunakan
        required: true
    },
    menus: [MenuSchema]
});

const RandomMenuModel = mongoose.model('RandomMenu', RandomMenuSchema);

module.exports = RandomMenuModel;