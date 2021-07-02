const express = require("express")
const bodyparser = require("body-parser")
const { Userdb, SlotDb } = require("./database/model2")
const connectDB = require('./database/connect2');
const app = express()
connectDB();
app.use(express.json())
app.use(bodyparser.urlencoded({ extended: true }))
    //using a perticular router
    /* const alienRouter = require('./routes/alien') */
selecting_timeslots = []
selecting_timeslots.push("12AM")
for (var i = 1; i < 12; i++) {
    selecting_timeslots.push(`${i}AM`)
}
selecting_timeslots.push("12PM")
for (var i = 1; i < 12; i++) {
    selecting_timeslots.push(`${i}PM`)
}

app.get("/", async(req, res) => {
    userdb = new Userdb({
        name: req.body.name,
        age: req.body.age,
        email: req.body.email
    })
    userdb.save();
    var year = req.body.year
    var month = req.body.month
    var day = req.body.day
    var date = `${day}/${month}/${year}`

    const d = new Date()
    var hour = d.getHours()
    if (hour > 12) {
        hour = (hour - 12) + "PM"
    } else if (hour == 0) {
        hour = "12AM"
    } else if (hour == 12) {
        hour = hour + "PM"
    } else {
        hour = hour + "AM"
    }
    dateformat_today = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear()
    if (!validating_date(year, month, day)) {
        return res.json("you can see the timeslots from the date  " + dateformat_today)
    }
    if (parseInt(year) + "" + parseInt(month) + "" + parseInt(day) == d.getFullYear() + "" + (parseInt(d.getMonth()) + 1) + "" + d.getDate()) {
        await SlotDb.find({ date: date }).then(user => {
                var timeslot_select = [...selecting_timeslots]

                //this will delete the timeslots before present hours

                var index = timeslot_select.findIndex(ele => {
                    return ele == hour
                })
                timeslot_select = timeslot_select.slice(index + 1, )

                //this will check any user have this slot 
                for (var i of user) {
                    let index = timeslot_select.findIndex(ele => {
                        return (ele == i.timeSlot)
                    });
                    timeslot_select.splice(index, index);
                }
                return res.json(`available timeslots for requested date ${date} are ${timeslot_select}`)

            }

        );
        /* catch(err => {
                    var index = timeslot_select.findIndex(ele => {
                        return ele == hour
                    })
                    console.log(index)
                    index = index + 1
                    console.log(index)
                    timeslot_select = timeslot_select.slice(index, )
                    console.log(timeslot_select)
                }) */

        return res.json(`timeslots available for the date ${date} are ${timeslot_select}`)

    } else {

        await SlotDb.find({ date: date }).then(user => {
                var timeslot_select = [...selecting_timeslots]

                for (var i of user) {
                    let index = timeslot_select.findIndex(ele => {
                        return (ele == i.timeSlot)
                    });

                    timeslot_select.splice(index, 1);

                }
                return res.json(`timeslots available for the date ${date} are ${timeslot_select}`)
            }

        ).catch(err => {
            console.log(err)
        })

    }



})

function validating_date(year, month, day, timeslot = -1) {
    const d = new Date();

    if (parseInt(year) < parseInt(d.getFullYear())) {

        return false
    }
    if (parseInt(month) < parseInt(d.getMonth()) + 1) {

        return false
    }
    if (parseInt(day) < parseInt(d.getDate())) {


        return false
    }
    if (timeslot == -1) {
        // if the get home page api requested then there is no need to mention timeslot and also no need to check the below condition

        return true
    }


    if (year + "" + month + "" + day == d.getFullYear() + "" + (parseInt(d.getMonth()) + 1) + "" + d.getDate()) {
        var result_noon = timeslot.substring(timeslot.length - 2)
        if (result_noon == "PM") {
            if (parseInt(timeslot) == 12) {
                timeslot = parseInt(timeslot)

            } else {
                timeslot = parseInt(timeslot) + 12
            }

        } else {
            if (parseInt(timeslot) == 12) {
                timeslot = 0
            }
        }

        if (parseInt(timeslot) <= parseInt(d.getHours())) {
            return false

        }
    }


    return true
}

app.post("/bookingslot", async(req, res) => {
    var year = req.body.year
    var month = req.body.month
    var day = req.body.day
    var date = `${day}/${month}/${year}`
    const d = new Date()
    dateformat_today = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear()
    var timeSlot = req.body.timeSlot

    if (!validating_date(year, month, day, timeSlot)) {
        return res.json(`you can't book slots in past`)
    }

    var valid = true
    await SlotDb.find({ date: date }).then(user => {

        for (var i of user) {
            if (i.timeSlot == timeSlot) {
                valid = false
                break
            }
        }

    }).catch(err => {
        console.log("no user")
    })

    if (!valid) {
        return res.json("someone already booked this slot")
    }

    slotDb = new SlotDb({
        date: date,
        timeSlot: timeSlot,
        username: req.body.email
    })
    slotDb.save();
    return res.json(`your slot is booked at ${timeSlot} on ${date}`)
})

function lastSevenDays() {
    var dates = []
    const d = new Date();
    for (var i = 1; i < 8; i++) {
        d.setDate(d.getDate() - 1);
        dates.push({ date: `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}` })
    }
    return dates
}
app.get("/totalbookings", async(req, res) => {
    var ne_list = lastSevenDays()
    await SlotDb.find({ $or: ne_list }).then(user => {
        return res.json(`total bookings in last  7 days are ${user.length}`)
    });
    return res.json("no user")


});

app.get("/maximumbookedslots", async(req, res) => {
        var slots_list = []
        var ne_list = lastSevenDays()
        await SlotDb.find({ $or: ne_list }).then(users => {
            for (var user of users) {
                slots_list.push(user.timeSlot)

            }

            //checking most repeated element in a list
            var arr1 = slots_list;
            var mf = 1;
            var m = 0;
            var item;
            for (var i = 0; i < arr1.length; i++) {
                for (var j = i; j < arr1.length; j++) {
                    if (arr1[i] == arr1[j])
                        m++;
                    if (mf < m) {
                        mf = m;
                        item = arr1[i];
                    }
                }
                m = 0;
            }
            console.log(item + " ( " + mf + " times ) ");

            return res.json(`total bookings in last  7 days are ${item}`)
        });
        return res.json("no user")

    })
    /* app.use("/aliens", alienRouter) */
app.set("view engine", "ejs");
app.set("views", 'views')

app.listen(4000, () => {
    console.log("connected port 4000")
})