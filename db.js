const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://userAngular:passwordAngular@cluster0.is2jg.mongodb.net/node-angular', (err) => {
    if(!err)
    console.log('MongoDB connection succeeded.');
    else 
    console.log('Error in DB connection: ' + JSON.stringify(err, undefined, 2));
}); 

module.exports = mongoose;