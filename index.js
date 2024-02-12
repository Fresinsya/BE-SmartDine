const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());


app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(3000, () => {
    console.log("berhasil")
})