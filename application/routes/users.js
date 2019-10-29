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
            const userDetail = results[0];
            console.log(userDetail);
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

})

router.get('/profile', (req, res) => {
    const sql = `select * from patient;`;

    db.query(sql, (err, result, fields) => {
        if (err) throw err;
        var patientProfile = result[0];
        console.log(patientProfile);
        res.render('patientProfile', {
            patientProfile: patientProfile
        });
    });
});


module.exports = router
