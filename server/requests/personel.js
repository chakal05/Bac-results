const express = require("express");
let router = express.Router();
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/peltier", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(12);
// 'useFindAndModify' set to false
mongoose.set("useFindAndModify", false);
//Connection to db

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

// Personel schema

const personelSchema = new mongoose.Schema({
  name: String,
  departement: String,
  telephone: Number,
  email: String,
  adresse: String,
  city: String,
  birthdate: String,
  username: String,
  password: String,
  profil: String
});

async function loadPersonel() {
  let personel = mongoose.model("personel", personelSchema);
  return personel;
}

// add personel

router.post("/", async function(req, res) {
  const query = await loadPersonel();
  let hashedPass = bcrypt.hashSync(req.body.password, salt);
  const newPersone = {
    name: req.body.name,
    departement: req.body.departement,
    telephone: req.body.telephone,
    email: req.body.email,
    adresse: req.body.adresse,
    city: req.body.city,
    birthdate: req.body.birthdate,
    password: hashedPass,
    profil: req.body.profil
  };

  const newPersonel = new query(newPersone);
  newPersonel.save(err => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(`Message from db: Inserted a new row`);
  });
});

// get personel list

router.get("/", async function(req, res) {
  const query = await loadPersonel();
  if (req.query.data === "personel") {
    query
      .find(
        { _id: { $ne: req.query.id } },
        {
          departement: 0,
          telephone: 0,
          email: 0,
          adresse: 0,
          city: 0,
          birthdate: 0,
          password: 0
        },
        (error, personelList) => {
          if (error) return res.status(500).send(error);
          else return res.status(200).send(personelList);
        }
      )
      .catch(err => {
        throw err;
      });
  } else if (req.query.data === "receiver") {
    query
      .find({ _id: req.query.id }, (error, persone) => {
        if (error) return res.status(500).send(error);
        return res.status(200).send(persone);
      })
      .catch(err => {
        throw err;
      });
  } else if (req.query.data === "doctorList") {
    let docList = [];
    query
      .find({ profil: req.query.profil }, (error, doctorList) => {
        if (error) return res.status(500).send(error);

        doctorList.forEach(el => {
          docList.push(el.name);
        });
        return res.status(200).send(docList);
      })
      .catch(err => {
        throw err;
      });
  } else {
    query
      .find({ profil: req.query.profil }, (error, personelList) => {
        if (error) return res.status(500).send(error);
        return res.status(200).send(personelList);
      })
      .catch(err => {
        throw err;
      });
  }
});

// Edit personel

router.put("/", async function(req, res) {
  const query = await loadPersonel();

  let hashedPass = bcrypt.hashSync(req.body.password, salt);
  const newEdit = {
    name: req.body.name,
    departement: req.body.departement,
    telephone: req.body.telephone,
    email: req.body.email,
    adresse: req.body.adresse,
    city: req.body.city,
    birthdate: req.body.birthdate,
    password: hashedPass
  };
  await query.findByIdAndUpdate(
    req.body.id,
    newEdit,
    { new: true },

    err => {
      if (err) return res.status(500).send(err);
      return res.status(200).send("Edited one item from server/personel");
    }
  );
});

router.put("/:id", async function(req, res) {
  const query = await loadPersonel();
  if (req.body.flag === "updateProfil") {
    query
      .find(
        { _id: req.body.id },
        {
          departement: 0,
          birthdate: 0,
          password: 0
        },
        (err, personel) => {
          if (err) return res.status(500).send(err);
          else {
            let persone = personel[0];
            query.findByIdAndUpdate(
              req.body.id,
              {
                name: req.body.name || persone.name,
                email: req.body.email || persone.email,
                adresse: req.body.adresse || persone.adresse,
                city: req.body.city || persone.city,
                telephone: req.body.telephone || persone.telephone
              },
              { new: true },
              err => {
                if (err) return res.status(500).send(err);
                else {
                  return res.status(200).send("Profil information was updated");
                }
              }
            );
          }
        }
      )
      .catch(err => {
        throw err;
      });
  } else {
    if (req.body.flag === "updatePass") {
      query.find(
        { _id: req.body.id },
        {
          _id: 0,
          name: 0,
          adresse: 0,
          city: 0,
          telephone: 0,
          email: 0,
          profil: 0,
          departement: 0,
          birthdate: 0,
          __v: 0
        },
        (err, result) => {
          if (err) throw err;
          else {
            let dBpass = result[0];
            let check = bcrypt.compareSync(req.body.pass, dBpass.password);

            
            if (check) {
              let hashedPass = bcrypt.hashSync(req.body.newPass, salt);
              query
                .findByIdAndUpdate(
                  req.body.id,
                  {
                    password: hashedPass
                  },
                  { new: true },
                  err => {
                    if (err) return res.status(500).send(err);
                    else return res.status(200).send("Your password was updated");
                  }
                )
                .catch(err => {
                  return res.status(500).send(err);
                });
            }
          }
        }
      );
    }
  }
});

// delete personel

router.delete("/", async function(req, res) {
  let query = await loadPersonel();
  query.findByIdAndRemove(req.body.id, (err, doc) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(`Deleted one item`);
  });
});

module.exports = router;
