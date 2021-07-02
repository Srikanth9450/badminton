"use strict";

var mongoose = require("mongoose");

var badmintonUsers = new mongoose.Schema({
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
var badmintonSlots = new mongoose.Schema({
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
var Userdb = mongoose.model('badmintondata', badmintonUsers);
var SlotDb = mongoose.model('badmintonSlotdata', badmintonSlots);
module.exports = {
  Userdb: Userdb,
  SlotDb: SlotDb
};