const mongoose = require('mongoose');

var Location = mongoose.model('Location', {
    locationId: {type: Number},
    price: {type: Number},
    lat: {type: Number},
    lng: {type: Number},
    country: {type: String},
    regionState: {type: String},
    city: {type: String},
    address: {type: String},
    title: {type: String},
    distanceFromCenter: {type: String},
    imageMain: {type: String},
    imageShowcase1: {type: String},
    imageShowcase2: {type: String},
    imageShowcase3: {type: String},
    roomType: {type: String},
    size: {type: Number},
    bathrooms: {type: Number},
    bedrooms: {type: Number},
    wifi: {type: String},
    breakfast: {type: String},
    pets: {type: String},
    description: {type: String},
    score: {type: Number},
    excelent: {type: Number},
    veryGood: {type: Number},
    normal: {type: Number},
    bad: {type: Number},
    worse: {type: Number},
    numberOfReviews: {type: Number},
    dateAvailableCheckIn: {type: String},
    dateAvailableCheckOut: {type: String}
});

module.exports = {Location};