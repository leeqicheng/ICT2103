var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
var randtoken = require('rand-token');
var db = require('./connection.js'); // db is pool


router.get('/', function(req, res) {

  
  db.establishConnection(function(conn) {
    conn.collection("SchoolroomwithLoc").find({school_room_name:"DR 5A"}).toArray(function(err, result) {
      if (err) throw err;
      res.send(result);
    })     
  });
}); 
module.exports = router;