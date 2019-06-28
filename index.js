const mongo = require("mongodb").MongoClient;
const client = require("socket.io").listen(4000).sockets;

//connect to mongodb

mongo.connect("mongodb://localhost/mongochat", (err, db) => {
  if (err) throw err;

  console.log("connected to mongodb");

  //connect to socket.io
  client.on("connection", () => {
    let chat = db.collection("chats");

    //create a function to send status

    sendStatus = s => {
      client.emit("status", s);
    };

    //get chat from the collection

    chat
      .find()
      .limit(100)
      .sort({ _id: 1 })
      .toArray((err, res) => {
        if (err) throw err;
        //emit the messages
        client.emit("input", res);
      });
  });
});
