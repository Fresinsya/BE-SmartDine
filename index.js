const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("./config/mongoo")

const app = express();

mongoose.then(()=>{
    console.log("mongoose berhasil")
})
.catch(()=>{
    console.log("mongoose gagal")
})
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());


app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(3000, () => {
    console.log("berhasil")
})