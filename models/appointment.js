const mongoose = require('mongoose');

var Appointment = mongoose.model('Appointment', {
    
    reservationNumber: {type: Number},
    locationId: {type: Number},
    guests: {type: String},
    days: {type: Number},
    price: {type: Number},
    address: {type: String},
    fromDate: {type: String},
    toDate: {type: String},
    propertyType: {type: String},
    clientName: {type: String},
    clientSurname: {type: String},
    clientEmail: {type: String},
    clientPhone: {type: Number},
    arrivalTime: {type: String},
    taxi: {type: String},
    carRental: {type: String} 
});

module.exports = {Appointment};