const mongoose = require("mongoose")
const badmintonUsers = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true

    },
    email: {
        type: String,
        required: true

    }


});
const badmintonSlots = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    timeSlot: {
        type: String,
        required: true

    },
    username: {
        type: String,
        required: true
    }


});

const Userdb = mongoose.model('badmintondata', badmintonUsers);
const SlotDb = mongoose.model('badmintonSlotdata', badmintonSlots);

module.exports = { Userdb, SlotDb };