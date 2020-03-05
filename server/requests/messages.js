const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/peltier", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// 'useFindAndModify' set to false

mongoose.set("useFindAndModify", false);
//Connection to db

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

// Message schema

const messageSchema = new mongoose.Schema({
  senderName: String,
  userFrom: String,
  userTo: String,
  headline: String,
  message: String,
  time: String,
  userToRead: String
});

async function loadMessages() {
  let message = mongoose.model("messages", messageSchema);
  return message;
}

// add Message

router.post("/", async function(req, res) {

  let payload = {
    senderName: req.body.name,
    userFrom: req.body.from,
    userTo: req.body.to,
    headline: req.body.headline,
    message: req.body.message,
    time: req.body.time,
    userToRead: req.body.user_to_read
  };

  let query = await loadMessages();
  const newMessage = new query(payload);
  newMessage.save(err => {
    if (err) return res.sendStatus(500).send(err);
    else return res.status(200).send(`Message from db: Inserted a new row`);
  });
});

// get personel list

router.get("/", async function(req, res) {
  const query = await loadMessages();
  // Get all messages

  if (req.query.data === "messages") {
    query
      .find({ userTo: req.query.id }, (error, messages) => {
        if (error) return res.send(error);
        else return res.send(messages);
      })
      .catch(err => {
        throw err;
      });
  } else if (req.query.data === "unread") {
    // Get list of unread messages
    query
      .find({ userTo: req.query.id, userToRead: "no" }, (error, messages) => {
        if (error) return res.send(error);
        else return res.send(messages.length.toString());
      })
      .catch(err => {
        throw err;
      });
  } 
});

router.get("/:id", async function(req, res) {
  const query = await loadMessages();
  query
    .find({ _id: req.query.id }, (error, messages) => {
      if (error) {
        return res.status(500).send(error);
      } else {
        return res.status(200).send(messages);
      }
    })
    .catch(err => {
      throw err;
    });
});

router.put("/:id", async function(req, res) {
  const query = await loadMessages();
  const update = {
    userToRead: 'yes'
  };
  await query.findByIdAndUpdate(
    req.body.id,
    update,
    { new: true, upsert: true },

    err => {
      if (err) return res.status(500).send(err);
      return res.status(200).send("updated message status");
    }
  );
});

// delete Message

router.delete("/", async function(req, res) {
  
  id = req.body.id;
  let query = await loadMessages();
  query.findByIdAndRemove(id, (err, doc) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(`Deleted one item`);
  });
});

module.exports = router;
