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

// Schema

const rapportSchema = new mongoose.Schema({
  description: String,
  patient: String,
  doctor: String,
  day: String,
  addedBy: String
});

async function loadRapport() {
  let rapport = mongoose.model("rapports", rapportSchema);
  return rapport;
}

// get rapports

router.get("/", async function(req, res) {
  let query = await loadRapport();
  await query.find({}, (error, rapports) => {
    if (error) return res.status(500).send(error);
    else return res.status(200).send(rapports);
  });
});

// Add a new bed allotment

router.post("/", async function(req, res) {
  const nyRapport = {
    description: req.body.description,
    patient: req.body.patient,
    doctor: req.body.doctor,
    day: req.body.day,
    addedBy: req.body.addedBy
  };

  let connexion = await loadRapport();
  let post = new connexion(nyRapport);

  if (post.save()) {
    res.status(200).send();
  }
});

// Edit item

router.put("/", async function(req, res) {
  let query = await loadRapport();
  await query.findByIdAndUpdate(req.body.id, req.body, { new: true }, err => {
    if (err) return res.status(500).send(err);
    return res.status(200).end();
  });
});

// Delete item

router.delete("/", async function(req, res) {
  id = req.body._id;
  let query = await loadRapport();
  query.findByIdAndRemove(id, (err, doc) => {
    if (err) return res.status(500).send(err);

    return res.status(200).end();
  });
});

module.exports = router;
