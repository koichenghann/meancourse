const User = require("../models/user");
const Schedule = require("../models/schedule");

//update schedule (post)
exports.updateSchedule = (req, res, next) => {
  console.log('updateSchedule ran');
  console.log( req.body.scheduleData);
  let userId = req.body.userId;
  //console.log(req.body.userId);
  if ( req.body.scheduleData != undefined ) {
    //console.log('not undefined')
    for( let sched of req.body.scheduleData ) {
      let day = sched.day;
      let startTime = sched.startTime;
      let endTime = sched.endTime;

      Schedule
        .update( { userId: userId, day: day }, sched )
        .then( result => {
          //console.log(result);
        })
        .catch( error => {
            console.log("error: " + error);
          res.status(500).json({

            message: "Error occured while updaing Schedule! don't panic"
          });
        });
    }
  }
}


exports.createSchedule = ( req, res, next ) => {
  for ( let sched of req.body.scheduleData){
    const schedule = new Schedule({
      userId: userId,
      day: sched.day,
      startTime: sched.startTime,
      endTime: sched.endTime
    });
    schedule.save().then( result => {
      console.log(result);
    })
    .catch( err => {
      res.status(500).json({
        message: "failed to create schedule : " + err
      });
    });
  }
}


//get schedule
exports.getSchedule = (req, res, next) => {
  Schedule
    .find( { userId: req.body.userId } )
    .then( result => {
      if ( result ) {
        res.status( 200 ).json( result );
      } else {
        res.status( 401 ).json({
          message: "No schedule found, this should be an error, all Collector by default has schedule"
        });
      }
    })
    .catch( error => {
      res.status( 500 ).json({
        message: "Error occured while retrieving schedule"
      });
    });
}
