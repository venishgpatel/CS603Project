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
    console.log('req.session : ' + JSON.stringify(req.session));
    res.render('index', {
        session: req.session ? req.session : ''
    });
});

router.get('/user', (req, res) => {
    res.render('user', {
        session: req.session ? req.session : ''
    });
});

router.get('/medicaldetails', (req, res) => {
  res.render('medicaldetails', {
      session: req.session ? req.session : ''
  });
});

router.post('/medicaldetails', (req,res) => {
  console.log("Hello medicaldetails");
  var medicinedetails = {
    patient_id : req.body.patientid,
    medication_reason : req.body.disease,
    medicine : req.body.medicine,
    quantity : req.body.quantity,
    time : req.body.time,
  };
  console.log("medicinedetails = " + JSON.stringify(medicinedetails));

  db.query('INSERT INTO patient_medication SET ?', medicinedetails, (err, results) => {
    if (err) {
      console.log("Insert into patient_medication table failed." + err);
      res.send(err);
    } else {
      //res.send("Results " + JSON.stringify(results));
      res.render("table");
      res.send('Medicaldetails updated sucessfully');
      console.log('Medicaldetails updated sucessfully');
    }
  });
});



router.get('/medicine', (req, res) => {
    var patientid = req.session.patientid;
    const sql = "select * from patient_medication where patient_id = ?";
    console.log(sql);
    db.query(sql, [patientid],(err, result, fields) => {
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
