const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'patientmedication',
    multipleStatements: true
});

//check if database is connected
db.connect((err)=> {
 	if (err) throw err;
 	console.log('DB Connected');
 });

// db.query("SELECT * from patient", (error, results, fields) => {
//   if (error) {
//     console.log("error = " + error);
//   } else {
//     console.log("Results = " + JSON.stringify(results));
//   }
// })

module.exports = db;
