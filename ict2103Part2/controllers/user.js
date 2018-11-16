var express = require('express');
var router = express.Router();
var db = require('./connection.js'); // db is pool
var common = require('./common.js');
const bcrypt = require('bcrypt');
// Change password
router.post('/password', function(req, res) {
  if (req.get("token") == null || req.get("token") == "") {
    res.statusCode = 200;
    return res.json({
      respond: "Invalid Token Key",
      errors: true
    });
  } else {
    var token = req.get("token");
    common.checksession(db, token, function(returnValue) {
      if (returnValue) {
        if (req.body.password != "" && req.body.password != null && req.body.newpassword != "" && req.body.newpassword != null) {
          db.establishConnection(function(conn) {
            conn.collection("studentWithSecureLogin").find({
              secure_login_session_token: token
            }, {
              secure_login_ID: "$secure_login_ID",
              secure_login_password: "$secure_login_password"
            }).toArray(function(err, rows, fields) {
              if (err) {
                res.statusCode = 200;
                return res.json({
                  respond: "Database error",
                  errors: true


                });
              } else {
                if (rows.length) {
                  var secureid = rows[0].secure_login_ID;
                  var securepassword = rows[0].secure_login_password;
                  var password = req.body.password;
                  var newpassword = req.body.newpassword;
                  bcrypt.compare(password, securepassword, function(err, result) {
                    if (result) {
                      if (err) {
                        res.statusCode = 200;
                        return res.json({
                          respond: "Something went wrong",
                          error: true
                        });
                      } else {
                        bcrypt.hash(newpassword, 10, function(err, hash) {
                          if (err) {
                            res.statusCode = 200;
                            return res.json({
                              respond: "Something went wrong",
                              error: true
                            });
                          } else {
                            var updatequery1 = {
                              $set: {
                                secure_login_password: hash
                              }
                            };
                            var updatequery2 = {
                              secure_login_ID: secureid
                            };
                            conn.collection("studentWithSecureLogin").updateOne(updatequery2, updatequery1, function(err, result) {
                              if (err) {
                                res.statusCode = 200;
                                return res.json({
                                  respond: "Database error",
                                  error: true
                                });
                              } else {
                                return res.json({
                                  respond: "Successfully Password Change",
                                  errors: false
                                });
                              }
                            });
                          }
                        });
                      }
                    } else {
                      res.statusCode = 200;
                      return res.json({
                        respond: "Password not match",
                        error: true
                      });
                    }
                  });
                } else {
                  res.statusCode = 200;
                  return res.json({
                    respond: "Invalid app Token or username",
                    error: true
                  });
                }
              }
            });
          });
        } else {
          res.statusCode = 200;
          return res.json({
            respond: "Missing Fields",
            error: true
          });
        }
      } else {
        res.statusCode = 200
        return res.json({
          respond: "Invalid session",
          errors: true
        });
      }
    });
  }
});

module.exports = router;