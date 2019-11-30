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
  var name = req.session.name;
  res.render('medicaldetails', {
      name : name,
      session: req.session ? req.session : ''
  });
});

router.get('/table', (req, res) => {
  var name = req.session.name;
  console.log("name", name);
  res.render('table', {
      name : name,
      session: req.session ? req.session : ''
  });
});

router.post('/medicaldetails', (req,res) => {
  console.log("Hello medicaldetails");
  var name = req.session.name;
  var page = "Medical";

  arr = req.body.time.split(':');
  var time = parseInt(arr[0])*60 + parseInt(arr[1]);

  var medicinedetails = {
    id1 : req.body.patientid,
    disease : req.body.disease,
    medicine : req.body.medicine,
    quantity : req.body.quantity,
    time : time,
  };
  console.log("medicinedetails = " + JSON.stringify(medicinedetails));

  db.query('INSERT INTO patient_medication SET ?', medicinedetails, (err, results) => {
    if (err) {
      console.log("Insert into patient_medication table failed." + err);
      res.send(err);
    } else {
      //res.send("Results " + JSON.stringify(results));
    res.render('table',{
      name : name,
      Page : page
    });
      //res.send('Medicaldetails updated sucessfully');
      console.log('Medicaldetails updated sucessfully');
    }
  });
});

router.get('/', function(req, res, next) {

  db.query('select profile.name,patient_details.phonenumber, patient_medication.medicine,patient_medication.quantity from profile join patient_details join patient_medication where profile.id = patient_details.id and profile.id = patient_medication.id1 and patient_medication.time = SUBTIME(CURRENT_TIME(), "0:-15:0")' , (err, results) => {
    if (err) {
      console.log("Errorr in select sql statement." + err);
      res.send(err);
    } else {
      //res.send("Results " + JSON.stringify(results));
      var messagedetails = {
        name : rname,
        disease : req.body.disease,
        medicine : req.body.medicine,
        quantity : req.body.quantity,
        time : req.body.time,
      };
    res.render('table',{
      name : name,
      Page : page
    });
      //res.send('Medicaldetails updated sucessfully');
      console.log('Medicaldetails updated sucessfully');
    }
  });
});

router.get('/medicine', (req, res) => {
    var patientid = req.session.userid;
    console.log(patientid);
    const sql = "select * from patient_medication where id1 = ? order by disease, medicine, time";
    console.log(sql);
    db.query(sql, [patientid],(err, result, fields) => {
        if (err) {
          console.log("Error in obtaining patient details" + err);
          res.send(err);
        } else {
          var patientMedication = result;

          var result = null;
          var resultlist = [];
          for (medication of patientMedication ) {
            if (result == null) {
              // First input row. Create a new output row.
              result = {};
              result['disease'] = medication['disease'];
              result['medicine'] = medication['medicine'];
              result['times'] = [medication['time']];
            } else {
              // Check if this input row matches previous input row on disease and medicine.
              if (result['disease'] == medication['disease'] &&
                  result['medicine'] == medication['medicine']) {
                    // Same as previous row. Just append the time.
                  result['times'].push(medication['time']);
              } else {
                  // different disease or medication. Start a new output row.
                  resultlist.push(result);

                  result = {};
                  result['disease'] = medication['disease'];
                  result['medicine'] = medication['medicine'];
                  result['times'] = [medication['time']];
              }
            }
          }

          if (result != null) {
            resultlist.push(result);
          }

          console.log(resultlist);

          res.render('medication', {
              patientMedication: resultlist,
              name : req.session.name
          });
        }
    });
});

module.exports = router;
