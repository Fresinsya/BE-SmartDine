const mongoose = require("mongoose");

const UserSkema = new mongoose.Schema(
    {
        nama: String,
        avatar: {
            type: String,
            default: "https://i.stack.imgur.com/l60Hf.png",
        },
        email: String,
        password: String,
        confirmPassword: String,
        alamat: String,
        usia: Number,
        gender: Number,
        telepon: Number,
        tinggiBadan: Number,
        beratBadan: Number,
        family_history: Number,
        kaloriHarian: Number
    }
)

const User = mongoose.model("User", UserSkema)
module.exports = User