"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var express = require("express");

var bodyparser = require("body-parser");

var _require = require("./database/model2"),
    Userdb = _require.Userdb,
    SlotDb = _require.SlotDb;

var connectDB = require('./database/connect2');

var app = express();
connectDB();
app.use(express.json());
app.use(bodyparser.urlencoded({
  extended: true
})); //using a perticular router

/* const alienRouter = require('./routes/alien') */

selecting_timeslots = [];
selecting_timeslots.push("12AM");

for (var i = 1; i < 12; i++) {
  selecting_timeslots.push("".concat(i, "AM"));
}

selecting_timeslots.push("12PM");

for (var i = 1; i < 12; i++) {
  selecting_timeslots.push("".concat(i, "PM"));
}

app.get("/", function _callee(req, res) {
  var year, month, day, date, d, hour;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          userdb = new Userdb({
            name: req.body.name,
            age: req.body.age,
            email: req.body.email
          });
          userdb.save();
          year = req.body.year;
          month = req.body.month;
          day = req.body.day;
          date = "".concat(day, "/").concat(month, "/").concat(year);
          d = new Date();
          hour = d.getHours();

          if (hour > 12) {
            hour = hour - 12 + "PM";
          } else if (hour == 0) {
            hour = "12AM";
          } else if (hour == 12) {
            hour = hour + "PM";
          } else {
            hour = hour + "AM";
          }

          dateformat_today = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();

          if (validating_date(year, month, day)) {
            _context.next = 12;
            break;
          }

          return _context.abrupt("return", res.json("you can see the timeslots from the date  " + dateformat_today));

        case 12:
          if (!(parseInt(year) + "" + parseInt(month) + "" + parseInt(day) == d.getFullYear() + "" + (parseInt(d.getMonth()) + 1) + "" + d.getDate())) {
            _context.next = 18;
            break;
          }

          _context.next = 15;
          return regeneratorRuntime.awrap(SlotDb.find({
            date: date
          }).then(function (user) {
            var timeslot_select = _toConsumableArray(selecting_timeslots); //this will delete the timeslots before present hours


            var index = timeslot_select.findIndex(function (ele) {
              return ele == hour;
            });
            timeslot_select = timeslot_select.slice(index + 1); //this will check any user have this slot 

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = user[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var i = _step.value;

                var _index = timeslot_select.findIndex(function (ele) {
                  return ele == i.timeSlot;
                });

                timeslot_select.splice(_index, _index);
              }
            } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                  _iterator["return"]();
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }

            return res.json("available timeslots for requested date ".concat(date, " are ").concat(timeslot_select));
          }));

        case 15:
          return _context.abrupt("return", res.json("timeslots available for the date ".concat(date, " are ").concat(timeslot_select)));

        case 18:
          _context.next = 20;
          return regeneratorRuntime.awrap(SlotDb.find({
            date: date
          }).then(function (user) {
            var timeslot_select = _toConsumableArray(selecting_timeslots);

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = user[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var i = _step2.value;
                var index = timeslot_select.findIndex(function (ele) {
                  return ele == i.timeSlot;
                });
                timeslot_select.splice(index, 1);
              }
            } catch (err) {
              _didIteratorError2 = true;
              _iteratorError2 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
                  _iterator2["return"]();
                }
              } finally {
                if (_didIteratorError2) {
                  throw _iteratorError2;
                }
              }
            }

            return res.json("timeslots available for the date ".concat(date, " are ").concat(timeslot_select));
          })["catch"](function (err) {
            console.log(err);
          }));

        case 20:
        case "end":
          return _context.stop();
      }
    }
  });
});

function validating_date(year, month, day) {
  var timeslot = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : -1;
  var d = new Date();

  if (parseInt(year) < parseInt(d.getFullYear())) {
    return false;
  }

  if (parseInt(month) < parseInt(d.getMonth()) + 1) {
    return false;
  }

  if (parseInt(day) < parseInt(d.getDate())) {
    return false;
  }

  if (timeslot == -1) {
    // if the get home page api requested then there is no need to mention timeslot and also no need to check the below condition
    return true;
  }

  if (year + "" + month + "" + day == d.getFullYear() + "" + (parseInt(d.getMonth()) + 1) + "" + d.getDate()) {
    var result_noon = timeslot.substring(timeslot.length - 2);

    if (result_noon == "PM") {
      if (parseInt(timeslot) == 12) {
        timeslot = parseInt(timeslot);
      } else {
        timeslot = parseInt(timeslot) + 12;
      }
    } else {
      if (parseInt(timeslot) == 12) {
        timeslot = 0;
      }
    }

    if (parseInt(timeslot) <= parseInt(d.getHours())) {
      return false;
    }
  }

  return true;
}

app.post("/bookingslot", function _callee2(req, res) {
  var year, month, day, date, d, timeSlot, valid;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          year = req.body.year;
          month = req.body.month;
          day = req.body.day;
          date = "".concat(day, "/").concat(month, "/").concat(year);
          d = new Date();
          dateformat_today = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
          timeSlot = req.body.timeSlot;

          if (validating_date(year, month, day, timeSlot)) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", res.json("you can't book slots in past"));

        case 9:
          valid = true;
          _context2.next = 12;
          return regeneratorRuntime.awrap(SlotDb.find({
            date: date
          }).then(function (user) {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = user[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var i = _step3.value;

                if (i.timeSlot == timeSlot) {
                  valid = false;
                  break;
                }
              }
            } catch (err) {
              _didIteratorError3 = true;
              _iteratorError3 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
                  _iterator3["return"]();
                }
              } finally {
                if (_didIteratorError3) {
                  throw _iteratorError3;
                }
              }
            }
          })["catch"](function (err) {
            console.log("no user");
          }));

        case 12:
          if (valid) {
            _context2.next = 14;
            break;
          }

          return _context2.abrupt("return", res.json("someone already booked this slot"));

        case 14:
          slotDb = new SlotDb({
            date: date,
            timeSlot: timeSlot,
            username: req.body.email
          });
          slotDb.save();
          return _context2.abrupt("return", res.json("your slot is booked at ".concat(timeSlot, " on ").concat(date)));

        case 17:
        case "end":
          return _context2.stop();
      }
    }
  });
});

function lastSevenDays() {
  var dates = [];
  var d = new Date();

  for (var i = 1; i < 8; i++) {
    d.setDate(d.getDate() - 1);
    dates.push({
      date: "".concat(d.getDate(), "/").concat(d.getMonth() + 1, "/").concat(d.getFullYear())
    });
  }

  return dates;
}

app.get("/totalbookings", function _callee3(req, res) {
  var ne_list;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          ne_list = lastSevenDays();
          _context3.next = 3;
          return regeneratorRuntime.awrap(SlotDb.find({
            $or: ne_list
          }).then(function (user) {
            return res.json("total bookings in last  7 days are ".concat(user.length));
          }));

        case 3:
          return _context3.abrupt("return", res.json("no user"));

        case 4:
        case "end":
          return _context3.stop();
      }
    }
  });
});
app.get("/maximumbookedslots", function _callee4(req, res) {
  var slots_list, ne_list;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          slots_list = [];
          ne_list = lastSevenDays();
          _context4.next = 4;
          return regeneratorRuntime.awrap(SlotDb.find({
            $or: ne_list
          }).then(function (users) {
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
              for (var _iterator4 = users[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var user = _step4.value;
                slots_list.push(user.timeSlot);
              } //checking most repeated element in a list

            } catch (err) {
              _didIteratorError4 = true;
              _iteratorError4 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
                  _iterator4["return"]();
                }
              } finally {
                if (_didIteratorError4) {
                  throw _iteratorError4;
                }
              }
            }

            var arr1 = slots_list;
            var mf = 1;
            var m = 0;
            var item;

            for (var i = 0; i < arr1.length; i++) {
              for (var j = i; j < arr1.length; j++) {
                if (arr1[i] == arr1[j]) m++;

                if (mf < m) {
                  mf = m;
                  item = arr1[i];
                }
              }

              m = 0;
            }

            console.log(item + " ( " + mf + " times ) ");
            return res.json("total bookings in last  7 days are ".concat(item));
          }));

        case 4:
          return _context4.abrupt("return", res.json("no user"));

        case 5:
        case "end":
          return _context4.stop();
      }
    }
  });
});
/* app.use("/aliens", alienRouter) */

app.set("view engine", "ejs");
app.set("views", 'views');
app.listen(4000, function () {
  console.log("connected port 4000");
});