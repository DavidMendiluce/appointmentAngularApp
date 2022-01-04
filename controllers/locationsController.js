const express = require('express');
var ObjectId = require('mongodb').ObjectID
var router = express.Router();

var {Location} = require('../models/locations');

function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
           !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
  }


router.get('/', (req, res) => {

    Location.find((err, docs) => {
        if(!err) {res.send(docs); }
        else {console.log('Error in Retriving Location :' + JSON.stringify(err, undefined, 2)); }
    });
    /*req.collection.find({})
    .toArray()
    .then(result => res.json(results))
    .catch(error => res.send(error))*/
});

router.get('/:id', (req,res) => {

    serviceId = req.params.id;
    if(isNumeric(serviceId)) {
        Location.findOne(
            {locationId: serviceId}, (err, doc) =>{
            if(!err) {res.send(doc); }
            else{console.log('Error retriving Location: ' + JSON.stringify(err, undefined, 2)); }
        })
    } else {
        Location.find(
            {$or:[{city:serviceId},{roomType:serviceId}]}, (err, doc) =>{
            if(!err) {res.send(doc); }
            else{console.log('Error retriving Location: ' + JSON.stringify(err, undefined, 2)); }
        })
    }
    
});


module.exports = router;