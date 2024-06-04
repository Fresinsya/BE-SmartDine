const mongoose = require("mongoose");

const UserSkema = new mongoose.Schema(
    {
        nama: String,
        avatar: {
            type: String,
            default: "https://res.cloudinary.com/dd8tyaph2/image/upload/v1716126670/profilr_zwq5dq.png",
        },
        email: String,
        password: String,
        confirmPassword: String,
        alamat: String,
        usia: {
            type: Number,
            default: 0,
        },
        gender: Number,
        telepon: Number,
        tinggiBadan: {
            type: Number,
            default: 0,
        },
        beratBadan:{
            type: Number,
            default: 0,
        },
        family_history: Number,
        kaloriHarian: Number
    }
)

const User = mongoose.model("User", UserSkema)
module.exports = User