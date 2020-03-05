const express = require("express");
let router = express.Router();
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/peltier", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// 'useFindAndModify' set to false
mongoose.set("useFindAndModify", false);
//Connection to db

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

// Personel schema

const patientSchema = new mongoose.Schema({
  name: String,
  telephone: Number,
  email: String,
  adresse: String,
  city: String,
  birthdate: String,
  doctor: String,
  profil: String,
  addedBy: String
});

async function loadPatients() {
  let patient = mongoose.model("patient", patientSchema);
  return patient;
}

// add personel

router.post("/", async function(req, res) {
  if (req.body.flag === "log") {
    let query = await loadPatients();
    await query.findOne(
      {
        username: req.body.username,
        password: req.body.password,
        profil: req.body.profil
      },
      (error, persone) => {
        if (error) return res.status(500).send(error);
        else console.log(persone);
        return res.status(200).send(persone);
      }
    );
  } else {
    const query = await loadPatients();
    const newPatient = new query(req.body);
    newPatient.save(err => {
      if (err) return res.status(500).send(err);
      return res.status(200).send(`Message from db: Inserted a new row`);
    });
  }
});

// get patient list

router.get("/", async function(req, res) {
  let query = await loadPatients();
  let names = [];
  if (req.query.data === "names") {
    await query.find({}, (error, patientsList) => {
      if (error) return res.status(500).send(error);

      patientsList.forEach(el => {
        names.push(el.name);
      })
      return res.status(200).send(names);
    });
  } else {
    await query.find({}, (error, patientsList) => {
      if (error) return res.status(500).send(error);

      return res.status(200).send(patientsList);
    });
  }
});

// Edit personel

router.put("/", async function(req, res) {
  let query = await loadPatients();
  await query.findByIdAndUpdate(
    req.body.id,
    req.body,
    { new: true },

    err => {
      if (err) return res.status(500).send(err);
      return res.status(200).send("Edited one item from server/personel");
    }
  );
});

// delete personel

router.delete("/", async function(req, res) {
  id = req.body._id;
  let query = await loadPatients();
  query.findByIdAndRemove(id, (err, doc) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(`Deleted one item`);
  });
});

module.exports = router;
