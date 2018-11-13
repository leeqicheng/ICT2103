var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var DATABASEUSERNAME = "ict2103";
var DATABASEPASSWORD = "cat123";
var DATABASEHOST = "ds141613.mlab.com";

// Connection URL
const url = 'mongodb://' + DATABASEUSERNAME + ':' + DATABASEPASSWORD + '@' + DATABASEHOST + ':41613' + '/ict2103';

var connection = [];
// Create the database connection
establishConnection = function(callback) {

  MongoClient.connect(url, {
      poolSize: 10
    }, function(err, db) {
      assert.equal(null, err);

      connection = db
      if (typeof callback === 'function' && callback)
        callback(connection)
    }
  )
}

function getconnection() {
  return connection
}

module.exports = {
  establishConnection: establishConnection,
  getconnection: getconnection
}