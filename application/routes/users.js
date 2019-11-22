/**
 * @module
 * this class will be used to handle get requests for issue
 */
const express = require('express');
const db = require('../configure/dbConfig.js');
var path = require('path');
var fs = require('fs');

//create router
const router = express.Router();

var session = '';


//route for authentication
router.post('/login', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
   const queryString = "select * from patient where patient_email = ?";

    db.query(queryString, [email], (err, results) => {
        if (err) {
            return res.status(400).send({
                err
            });
        }
        else {
          console.log("Results = " + JSON.stringify(results));
            const userDetail = results[0];
            req.session.user = userDetail.patient_email;
            req.session.patientid = userDetail.patient_id;
            console.log("UserDetail" + JSON.stringify(userDetail));
            if (!userDetail) {
                res.status(401).end('unauthenticated');
            }
            else if (email == userDetail.patient_email && password == userDetail.patient_password) {
                res.render('user', {userDetail: userDetail});
            }
            else {
                res.status(401).end('unauthenticated');
            }
        }
    })
})

router.post('/logout', function(req, res) {
    req.session.destroy(function() {
        console.log("user logged out.")
    });
    res.render('index');
});

//route for register new user
router.post('/register', (req, res) => {
  //console.log("Body = " + JSON.stringify(req.body));
  var users = {
    name : req.body.name,
    patient_email : req.body.email,
    patient_password : req.body.password,
  };
  //console.log("Users = " + JSON.stringify(users));

  db.query('INSERT INTO patient SET ?', users, (err, results) => {
    if (err) {
      console.log("Insert into patient table failed." + err);
      res.send(err);
    } else {
      //res.send("Results " + JSON.stringify(results));
      res.render('index');
      //console.log('user registered sucessfully');
    }
  })
})

router.get('/profile', (req, res) => {
  var userinfo = req.session.user;
  console.log("userinfo", userinfo);
    const sql = "select * from `patient` where `patient_email` = ?";

    db.query(sql,[userinfo] ,(err, result, fields) => {
        if (err) throw err;
        var patientProfile = result[0];
        console.log(JSON.stringify(patientProfile));
        res.render('patientProfile', {
            patientProfile: patientProfile
        });
    });
});


module.exports = router
