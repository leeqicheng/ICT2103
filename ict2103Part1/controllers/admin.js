 var express = require('express');
 var router = express.Router();

 var db = require('./connection.js'); // db is pool
 var common = require('./common.js');
 var fs = require("fs");

 router.get('/admin', function(req, res) {

   if (req.get("token") == null || req.get("token") == "") {
     res.statusCode = 200;
     return res.json({
       respond: "Invalid Token Key",
       errors: true
     });
   } else {
     var token = req.get("token");
     common.checksessionadmin(db, token, function(returnValue) {
       if (returnValue) {
         db.query('SELECT * FROM admin;', function(err, rows, fields) {
           if (err) {
             res.statusCode = 200
             return res.json({
               respond: "Database ran into some problem",
               errors: true
             });
           } else {
             var jsonArray = [];
             if (rows.length) {
               for (var i = 0; i < rows.length; i++) {
                 var jsonObject = {
                   accountid: rows[i].secure_login_ID,
                   adminid: rows[i].admin_ID,
                   adminname: rows[i].admin_name,
                   adminmatrics: rows[i].admin_matrics,
                   adminphone: rows[i].admin_phone,
                   admindob: rows[i].admin_dob,
                   adminaddress: rows[i].admin_address,
                   admindepartment: rows[i].department_ID,
                   adminimage: rows[i].admin_image,
                   adminactive: rows[i].admin_active,
                 }
                 jsonArray.push(jsonObject);
               }
             }
             return res.json({
               respond: jsonArray,
               errors: false
             });
           }
         });
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

router.get('/adminlist/noaccount', function(req, res) {

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
         db.query('SELECT * FROM admin;', function(err, rows, fields) {
           if (err) {
             res.statusCode = 200
             return res.json({
               respond: "Database ran into some problem",
               errors: true
             });
           } else {
             var jsonArray = [];
             if (rows.length) {
               for (var i = 0; i < rows.length; i++) {
                 if (rows[i].admin_active === 0 && rows[i].secure_login_ID < 1) {
                   var jsonObject = {
                     accountid: rows[i].secure_login_ID,
                     adminid: rows[i].admin_ID,
                     adminname: rows[i].admin_name,
                     adminmatrics: rows[i].admin_matrics,
                     adminphone: rows[i].admin_phone,
                     admindob: rows[i].admin_dob,
                     adminaddress: rows[i].admin_address,
                     admindepartment: rows[i].department_ID,
                     adminimage: rows[i].admin_image,
                     adminactive: rows[i].admin_active,
                   }
                   jsonArray.push(jsonObject);
                 }
               }
             }
             return res.json({
               respond: jsonArray,
               errors: false
             });
           }
         });
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

router.post('/admin', function(req, res) {
   if (req.get("token") == null || req.get("token") == "") {
     res.statusCode = 200;
     return res.json({
       respond: "Invalid Token Key",
       errors: true
     });
   } else {
     var token = req.get("token");
     common.checksessionadmin(db, token, function(returnValue) {
       if (returnValue) {
         if (req.body.name != "" && req.body.name != null && req.body.matrics != "" && req.body.matrics != null && req.body.phone != "" && req.body.phone != null && req.body.dob != "" && req.body.dob != null && req.body.address != "" && req.body.address != null && req.body.departmentid != "" && req.body.departmentid != null) {
           var paremeters = {
             admin_matrics: req.body.matrics
           };
           db.query('SELECT admin_ID from admin where ? ', paremeters, function(err, rows, fields) {

             if (err) {
               res.statusCode = 200;
               return res.json({

                 respond: "Creating Account Failed , Database Error",
                 errors: true
               });
             } else {
               if (rows.length) {
                 res.statusCode = 200;
                 return res.json({
                   respond: "Admin Already Existed ",
                   errors: true
                 });
               } else {

                 var filename = "";
                 if (req.body.image !== "" && req.body.image != null) {
                   var image = req.body.image;
                   var base64Data = image.replace(/^data:image\/(png|gif|jpeg);base64,/, '');
                   filename = "/image/admin/" + new Date().getTime() + ".png";
                   var filepathupload = "public" + filename;
                   fs.writeFile(filepathupload, new Buffer(base64Data, "base64"), function(err) {
                     if (err) console.log(err);
                   });
                 }
                 var createadmin_query = {};
                 if (req.body.image !== "" && req.body.image != null) {
                   createadmin_query = {
                     admin_name: req.body.name,
                     admin_matrics: req.body.matrics,
                     admin_phone: req.body.phone,
                     admin_dob: req.body.dob,
                     admin_address: req.body.address,
                     admin_image: filename,
                     secure_login_ID: req.body.accountid,
                     department_ID: req.body.departmentid,
                     admin_active: req.body.active
                   };
                 } else {
                   createadmin_query = {
                     admin_name: req.body.name,
                     admin_matrics: req.body.matrics,
                     admin_phone: req.body.phone,
                     admin_dob: req.body.dob,
                     admin_address: req.body.address,
                     secure_login_ID: req.body.accountid,
                     department_ID: req.body.departmentid,
                     admin_active: req.body.active
                   };
                 }
                 var query = db.query('INSERT INTO admin SET ?', createadmin_query, function(err, result) {
                   if (err) {
                     res.statusCode = 200;
                     return res.json({
                       respond: "Creating admin Failed , Database Error",
                       errors: true
                     });
                   } else {
                     if (result) {
                       return res.json({
                         success: "Successfully Created Admin",
                         errors: false
                       });
                     }
                   }
                 });
               }
             }
           });
         } else {
           res.statusCode = 200
           return res.json({
             respond: "Missing Fields",
             errors: true
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

 // Update student
 router.put('/admin/:id', function(req, res) {
   if (req.get("token") == null || req.get("token") == "") {
     res.statusCode = 200;
     return res.json({
       respond: "Invalid Token Key",
       errors: true
     });
   } else {
     var id = req.params.id;
     var token = req.get("token");
     common.checksessionadmin(db, token, function(returnValue) {
       if (returnValue) {
         common.checkadminbymatrics(db, id, function(matrics_true) {
           if (matrics_true) {
             if (req.body.name != "" && req.body.name != null && req.body.matrics != "" && req.body.matrics != null && req.body.phone != "" && req.body.phone != null && req.body.dob != "" && req.body.dob != null && req.body.address != "" && req.body.address != null && req.body.departmentid != "" && req.body.departmentid != null) {
               var filename = "";
               if (req.body.image !== "" && req.body.image != null) {
                 var image = req.body.image;
                 var base64Data = image.replace(/^data:image\/(png|gif|jpeg);base64,/, '');
                 filename = "/image/student/" + new Date().getTime() + ".png";
                 var filepathupload = "public" + filename;
                 fs.writeFile(filepathupload, new Buffer(base64Data, "base64"), function(err) {
                   if (err) console.log(err);
                 });
               }
               var updatequery1 = {};
               if (req.body.image !== "" && req.body.image != null) {
                 updatequery1 = {
                   admin_name: req.body.name,
                   admin_matrics: req.body.matrics,
                   admin_phone: req.body.phone,
                   admin_dob: req.body.dob,
                   admin_address: req.body.address,
                   admin_image: filename,
                   secure_login_ID: req.body.accountid,
                   department_ID: req.body.departmentid,
                   admin_active: req.body.active
                 };
               } else {
                 updatequery1 = {
                   admin_name: req.body.name,
                   admin_matrics: req.body.matrics,
                   admin_phone: req.body.phone,
                   admin_dob: req.body.dob,
                   admin_address: req.body.address,
                   secure_login_ID: req.body.accountid,
                   department_ID: req.body.departmentid,
                   admin_active: req.body.active
                 };
               }

               var updatequery2 = {
                 admin_matrics: id
               }
               var query = db.query('UPDATE admin SET ? where ? ', [updatequery1, updatequery2], function(err, result) {
                 if (err) {
                   console.log(err)
                   res.statusCode = 200;
                   return res.json({
                     respond: "Database error",
                     error: true
                   });
                 } else {
                   return res.json({
                     respond: "Successfully Update Admin Particulars",
                     errors: false
                   });
                 }
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
               respond: "Admin Id Not Found",
               errors: true
             });
           }
         });
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