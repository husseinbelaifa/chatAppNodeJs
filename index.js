const mongo = require("mongodb").MongoClient;
const client = require("socket.io").listen(4000).sockets;

//connect to mongodb

mongo.connect("mongodb://localhost/mongochat", (err, db) => {
  if (err) throw err;

  console.log("connected to mongodb");

  //connect to socket.io
  client.on("connection", socket => {
    let chat = db.collection("chats");

    //create a function to send status

    sendStatus = s => {
      socket.emit("status", s);
    };

    //get chat from the collection

    chat
      .find()
      .limit(100)
      .sort({ _id: 1 })
      .toArray((err, res) => {
        if (err) throw err;
        //emit the messages
        socket.emit("input", res);
      });

    //handle input events

    socket.on("input", data => {
      let name = data.name;
      let message = data.message;

      if (name === "" || message === "") {
        sendStatus("please enter a name and message");
      } else {
        //insert to database

        chat.insert({ name: name, message: message }, () => {
          client.emit("output", [data]);

          sendStatus({
            message: "Message sent",
            clear: true
          });
        });
      }
    });

    //handle clear

    socket.on("clear", data => {
      //remvoe all chat

      chat.remove({}, () => {
        socket.emit("cleared");
      });
    });
  });
});
