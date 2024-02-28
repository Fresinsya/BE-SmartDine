const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true
  },
  idMenu: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
});

const RandomMenuSchema = new mongoose.Schema({
  idUser: {
    type: String,
    required: true
  },
  menus: [MenuSchema]
});

const RandomMenuModel = mongoose.model('RandomMenu', RandomMenuSchema);

module.exports = RandomMenuModel;