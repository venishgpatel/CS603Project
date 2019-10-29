/**
 * @module
 * this class will be used to handle get requests for issue
 */

const express = require('express');
const db = require('../configure/dbConfig.js');
var path = require('path');

//create router
const router = express.Router();

//route for authentication
router.get(['/', '/index'], (req, res) => {
    console.log('--Inside check session--');
    console.log('req.session : ' + req.session);
    res.render('index', {
        session: req.session ? req.session : ''
    });
});

router.get('/user', (req, res) => {
    res.render('user', {
        session: req.session ? req.session : ''
    });
});

router.get('/medicine', (req, res) => {
    var user_id = req.session.id;
    const sql = `select * from patient_medication`;
    console.log(sql);
    db.query(sql, (err, result, fields) => {
        if (err) throw err;
        var patientMedication = result[0];
        console.log(patientMedication);
        res.render('medication', {
            patientMedication: patientMedication,
            session: req.session ? req.session : ''
        });
    });
});

module.exports = router;
