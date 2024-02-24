const mongoose = require("mongoose");

const UserSkema = new mongoose.Schema(
    {
        nama : String,
        email : String,
        password : String,
        confirmPassword : String,
        alamat : String,
        usia : String,
        gender : Number,
        telepon : Number,
        tinggiBadan : Number,
        beratBadan : Number,
        family_history : Number,
        kaloriHarian : Number
    }
)

const User = mongoose.model("User", UserSkema)
module.exports = User