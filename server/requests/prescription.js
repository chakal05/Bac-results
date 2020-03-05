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

const prescriptionSchema = new mongoose.Schema({
  description: String,
  patient: String,
  doctor: String,
  medication: String,
  date: String,
  addedBy: String
});

async function loadPrescriptions() {
  let prescription = mongoose.model("prescriptions", prescriptionSchema);
  return prescription;
}

// get rapports

router.get("/", async function(req, res) {
  let query = await loadPrescriptions();
  await query.find({}, (error, rapports) => {
    if (error) return res.status(500).send(error);
    else return res.status(200).send(rapports);
  });
});

// Add a new bed allotment

router.post("/", async function(req, res) {
  const nyPresc = {
    description: req.body.description,
    patient: req.body.patient,
    medication: req.body.medication,
    date: req.body.date,
    addedBy: req.body.addedBy
  };

  let connexion = await loadPrescriptions();
  let post = new connexion(nyPresc);

  if (post.save()) {
    res.status(200).send();
  }
});

// Edit item

router.put("/", async function(req, res) {
  let query = await loadPrescriptions();
  await query.findByIdAndUpdate(req.body.id, req.body, { new: true }, err => {
    if (err) return res.status(500).send(err);
    return res.status(200).end();
  });
});

// Delete item

router.delete("/", async function(req, res) {
  id = req.body._id;
  let query = await loadPrescriptions();
  query.findByIdAndRemove(id, (err, doc) => {
    if (err) return res.status(500).send(err);

    return res.status(200).end();
  });
});

module.exports = router;
