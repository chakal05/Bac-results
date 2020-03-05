const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ credentials: true, origin: "http://localhost:8080" }));
app.use(helmet());


//Middleware

const auth = function(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(403).json({ error: "No credentials sent!" });
  }
  next();
};

const login = require("./requests/login");
const reservations = require("./requests/reservations");
const personel = require("./requests/personel");
const patients = require("./requests/patient");
const messages = require("./requests/messages");
const bedAllotment = require("./requests/bedAll");
const rapport = require("./requests/rapport");
const prescription = require('./requests/prescription');

app.use("/login", login);
app.use("/reservations", auth, reservations);
app.use("/personel", auth, personel);
app.use("/patient", auth, patients);
app.use("/messages", auth, messages);
app.use("/bedAll", auth, bedAllotment);
app.use("/rapport", auth, rapport);
app.use('/prescription', auth, prescription);


if(process.env.NODE_ENV === 'production'){
// Static folder
app.use(express.static(__dirname + "/public/"));
 
//SPA
app.get(/.*/, (req, res) => res.sendFile(__dirname + "/public/index.html"));

}

const port = process.env.port || 4000;
app.listen(port, () => console.log("APP RUNNING ON PORT 4000"));
