const express = require('express');
var ObjectId = require('mongodb').ObjectID
var router = express.Router();

var {Appointment} = require('../models/appointment');


router.get('/', (req, res) => {
    Appointment.find((err, docs) => {
        if(!err) {res.send(docs); }
        else {console.log('Error in Retriving Appointments :' + JSON.stringify(err, undefined, 2)); }
    });
    /*req.collection.find({})
    .toArray()
    .then(result => res.json(results))
    .catch(error => res.send(error))*/
});

router.get(':/id', (req,res) => {
    if(!ObjectId.isValid(req.params.id))
    return res.status(400).send(`No records with the given id: ${req.params.id}`);

    Appointment.findById(req.params.id, (err, doc) =>{
        if(!err) {res.send(doc); }
        else{console.log('Error retriving appointment: ' + JSON.stringify(err, undefined, 2)); }
    })
});

router.post('/', (req, res) => {
    var apm = new Appointment({
        reservationNumber : req.body.reservationNumber,
        locationId : req.body.locationId,
        guests: req.body.guests,
        days: req.body.days,
        price: req.body.price,
        address : req.body.address,
        fromDate : req.body.fromDate,
        toDate : req.body.toDate,
        propertyType: req.body.propertyType,
        clientName: req.body.clientName,
        clientSurname: req.body.clientSurname,
        clientEmail: req.body.clientEmail,
        clientPhone: req.body.clientPhone,
        arrivalTime: req.body.arrivalTime,
        taxi: req.body.taxi,
        carRental: req.body.carRental

    });
    apm.save((err,doc) =>{
        if(!err) {res.send(doc); }
        else {console.log('Error in Appointment Save: ' + JSON.stringify(err, undefined, 2)); }
    });
});

router.put('/:id', (req, res) => {
    if(!ObjectId.isValid(req.params.id))
    return res.status(400).send(`No records with the given id: ${req.params.id}`);

    var apm = {
        reservationNumber : req.body.reservationNumber,
        locationId : req.body.locationId,
        guests: req.body.guests,
        days: req.body.days,
        price: req.body.price,
        address : req.body.address,
        fromDate : req.body.fromDate,
        toDate : req.body.toDate,
        propertyType: req.body.propertyType,
        clientName: req.body.clientName,
        clientSurname: req.body.clientSurname,
        clientEmail: req.body.clientEmail,
        clientPhone: req.body.clientPhone,
        arrivalTime: req.body.arrivalTime,
        taxi: req.body.taxi,
        carRental: req.body.carRental

    }

    Appointment.findByIdAndUpdate(req.params.id, {$set: emp}, {new: true}, (err, doc) =>{
        if(!err) {res.send(doc); }
        else {console.log('Error in Appointment Update :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.delete('/:id', (req, res) => {
    if(!ObjectId.isValid(req.params.id))
    return res.status(400).send(`No records with the given id: ${req.params.id}`);

    Appointment.findByIdAndRemove(req.params.id, (err, doc) =>{
        if(!err) {res.send(doc); }
        else {console.log('Error in Employee Delete :' + JSON.stringify(err, undefined, 2)); }
    });
});

module.exports = router;