const mongo = require("mongodb").MongoClient;
const client = require("socket.io").listen(4000).sockets;

//connect to mongodb

mongo.connect("mongodb://localhost/mongochat", (err, db) => {
  if (err) throw err;
  console.log("connected to mongodb");
});
