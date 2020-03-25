const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Schedule = require("../models/schedule");





exports.test = ( req, res, next ) => {
  console.log('test');
  res.status(201).json({message: 'test ran'});
}

exports.findUser = ( req, res, next ) => {
  User.find({ username: req.body.username }).then( result => {
    res.status(201).json(result);
  });
}
exports.getRecyclers = ( req, res, next ) => {
  User.find({userType: 'recycler'}, {_id:1, username:1, fullName:1}).then( result => {
    res.status(201).json(result);
  });
}
exports.getCollectors = ( req, res, next ) => {
  User.find({userType: 'collector'}, {_id:1, username:1, fullName:1}).then( result => {
    res.status(201).json(result);
  });
}


exports.createCollector = (req, res, next) => {
  let userData = req.body.userData;
  let scheduleData = req.body.scheduleData;
  console.log(scheduleData);

  //create user first
  const user    = new User(userData);
  const userId  = user._id;
  user.totalPoints = 0;
  bcrypt.hash(user.password, 10).then(hash => {
    user.password = hash;
    user
    .save()
    .then( result => {
      console.log("result: " + result);
      console.log("result: " + JSON.stringify(result));
      if (result) {
        res.status(201).json({
          message: "User (collector) created succesfully!",
          result: result
        });

        for ( let sched of scheduleData){
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
    })
    .catch( err => {
      res.status(500).json({
        message: "failed to create user (collector) : " + err,
      });
    });
  });


  console.log(JSON.stringify(user));
  console.log("user : " + userData.username);


}


exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      username    : req.body.username,
      password    : hash,
      fullName    : req.body.fullName,
      totalPoints : 0,
      ecoLevel    : 'newbie',
      address     : req.body.address,
      schedule    : null,
      userType    : req.body.userType
    });

    user
      .save()
      .then(result => {
        res.status(201).json({
          message: "User created succesfully!",
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          message: "ada masalah, tolong"
        });
        console.log(err);
      });
  });
}


exports.checkUserExist = (req, res, next) => {
  /*let userlist;
  let username = req.body.username
  User.find({username: username}).then(documents => {
    res.status(200).json(documents)
  })*/
  User.find({username: req.params.username.toString()}).then(user => {
    if (user) {
      res.status(200).json({userFound: user.length, message: 'found'});
    } else {
      res.status(401).json({message: 'not found'});
    }
  })
  .catch(error => {
    res.status(500).json({message: 'error finding'});
  });
}


exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({username: req.body.username})
  .then(user => {
    console.log(user);
    if (user == null) {
      console.log('user not found');
      return false;
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.password, user.password);
  })
  .then(result => {
    if (!result) {
      return res.status(401).json({
        message: "Authentication failed: incorrect password"
      });
    }
    const token = jwt.sign(
      { userId: fetchedUser._id,
        username: fetchedUser.username,
        fullname: fetchedUser.fullname,
        totalPoints: fetchedUser.totalPoitns,
        ecoLevel: fetchedUser.ecoLevel,
        address: fetchedUser.address,
        schedule: fetchedUser.schedule,
        userType: fetchedUser.userType
      },
      "custom_token_key_value_jacky_is_hot",
      { expiresIn: "1h" }
    );
    res.status(200).json({
      token: token,
      expiresIn: 3600,
      username: fetchedUser.username,
      fullName: fetchedUser.fullName,
      userId: fetchedUser._id,
      userType: fetchedUser.userType
    });
  })
  .catch(err => {
    console.log("[error] at user Login: " + err);
    return res.status(401).json({
      message: "Authentication failed: [error]: " + err
    });
  });
}


//get recycler (post)
exports.getUser = (req, res, next) => {
  User
    .findOne( { _id: req.body._id } )
    .then( user => {
      if ( user ) {
        res.status( 200 ).json({
          found: true,
          _id: user._id,
          username: user.username,
          fullName: user.fullName,
          totalPoints: user.totalPoints,
          ecoLevel: user.ecoLevel,
          address: user.address,
          userType: user.userType
        });
      } else {
        res.status( 404 ).json({
          found: false,
          message: "user not found"
        });
      }
    })
    .catch( error => {
      res.status( 500 ).json({
        found: false,
        message: "Error occured while getting user"
      })
    });
}


//validate password of user
exports.validatePassword = (req, res, next) => {
  let _id = req.body._id;
  User
    .findOne({ _id: _id })
    .then( user => {
      if ( user ) {
        bcrypt
          .compare(req.body.password, user.password)
          .then( result => {
            if ( result ) {
              res.status(200).json({
                valid: true
              });
            } else {
              res.status(401).json({
                valid: false
              });
            }
          });
      } else {
        res.status(401).json({
          valid: false
        });
      }
    })
    .catch( error => {
      res.status(500).json({
        message: "Error occured while validating password"
      });
    });
}


//update Password (wiht server side validation)
exports.updatePassword = (req, res, next) => {
  let _id = req.body._id;
  User
    .findOne({ _id: _id })
    .then( user => {
      if ( user ) {
        bcrypt
          .compare(req.body.password, user.password)
          .then( result => {
            if ( result ) {

              //hash the new password
              bcrypt
                .hash( req.body.newPassword, 10 )
                .then( hash => {
                  //save the new newPassword
                  User
                    .updateOne( { _id: _id },  { password: hash } )
                    .then( result => {
                      if ( result.n > 0 ) {
                        res.status(200).json({message: "Updated password Succesfully!"});
                      } else {
                        res.status(401).json({message: "Update password Failed!"});
                      }
                    })
                    .catch( error => {
                      res.status(500).json({message: "Error occured when updating password!"});
                    });
                })
                .catch( error => {
                  res.status(500).json({message: "Error occured when hashing password!"});
                });
              res.status(200).json({
                message: "Update password: password valid!"
              });
            } else {
              res.status(401).json({
                message: "Update password Failed!"
              });
            }
          });
      } else {
        res.status(401).json({
          message: "Update password Failed!"
        });
      }
    })
    .catch( error => {
      res.status(500).json({
        message: "Error occured while validating password"
      });
    });
}


//update user (post)
exports.updateProfile = (req, res, next) => {

  //let scheduleData = req.body.scheduleData;
  let userData = req.body.userData;
  console.log('user data' +JSON.stringify(userData));
  let _id = req.body.userId;

  if ( userData.password == null || userData.password == "" ) {
    const user = {
      username    : userData.username,
      fullName    : userData.fullName,
      address     : userData.address,
    };

    User
      .updateOne( { _id: _id }, user )
      .then( result => {
        if ( result.n > 0 ) {
          res.status( 200 ).json({
            updated: true,
            message: "Udate Successfull!"
          });
        } else {
          res.status( 200 ).json({
            updated: false,
            message: "Udate Failed!"
          });
        }
      })
      .catch( error => {
        res.status( 500 ).json({
          updated: false,
          message: "Error occured while updating User data"
        });
      });


  } else {
    const user = {
      username    : userData.username,
      password    : userData.password,
      fullName    : userData.fullName,
      address     : userData.address,
    };
    bcrypt.hash( req.body.userData.password, 10 )
      .then( hash => {
        user.password = hash;
        User
          .updateOne( { _id: _id }, user )
          .then( result => {
            if ( result.n > 0 ) {
              res.status( 200 ).json({
                updated: true,
                message: "Udate Successfull!"
              });
            } else {
              res.status( 200 ).json({
                updated: false,
                message: "Udate Failed!"
              });
            }
          })
          .catch( error => {
            res.status( 500 ).json({
              updated: false,
              message: "Error occured while updating User data"
            });
          });
        }).catch(err=>{console.log("no hash")});

      }

  /*if ( scheduleData != undefined ) {
    for( let sched of scheduleData ) {
      let day = sched.day;
      let startTime = sched.startTime;
      let endTime = sched.endTime;

      Schedule
        .updateOne( { userId: _id, day: day }, sched )
        .then( result => {
          // do not res here.
        })
        .catch( error => {
          res.status(500).json({
            message: "Error occured while updaing Schedule! don't panic"
          });
        });
    }
  }*/

}

//update schedule (post)
/*exports.updateSchedule = (req, res, next) => {
  if ( req.scheduleData != undefined ) {
    for( let sched of req.scheduleData ) {
      let day = sched.day;
      let startTime = sched.startTime;
      let endTime = sched.endTime;

      Schedule
        .updateOne( { userId: _id, day: day }, sched )
        .then( result => {
          // do not res here.
        })
        .catch( error => {
          res.status(500).json({
            message: "Error occured while updaing Schedule! don't panic"
          });
        });
    }
  }
}*/




//get schedule
/*exports.getSchedule = (req, res, next) => {
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
}*/
