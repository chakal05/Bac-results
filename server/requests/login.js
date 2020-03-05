require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Mongo = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/"; 
const jwt = require("jsonwebtoken");


async function checkUser() {
  const connection = await Mongo.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  return connection.db("peltier").collection("personels");
}

router.post("/", async function(req, res) {
  let query = await checkUser();

  let result = await query.findOne({
    email: req.body.email,
    profil: req.body.profil
  });

  if (result) {
    let check = bcrypt.compareSync(req.body.password, result.password);

    if (check) {
      const accesToken = jwt.sign(result, process.env.ACCESS_TOKEN_SECRET);
      return res.status(200).json({ accesToken: accesToken });

    } else {
      return res.status(503).json({ message: "password doesnt match dB pass" });
    }

    
  } else if (!result) {
    return res.status(503).json({ message: "Email and profil not found" });
  }

  if(res.finished){
    console.log(`sent res`);
  }
});

module.exports = router;
