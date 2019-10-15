const nunjucks = require('nunjucks');
const med = require('./Medication.json');
const fs = require('fs');  // The file system module

//console.log(med);
// Tells nunjucks where to look for templates and set any options
nunjucks.configure('layouts', { autoescape: true });
let outString = nunjucks.render('MedicineDetails.njk', med);
fs.writeFileSync('./output/medicine.html', outString);
console.log("Wrote file");
