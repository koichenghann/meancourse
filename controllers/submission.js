const Submission = require('../models/submission');
const User = require('../models/user');
const Material = require('../models/material');
/*
  There are three type of get submission (all criteria include material)
    1. criteria include recycler
    2. criteria include collector
    3. criteria include material only
*/
/*
  Extra features:
    1. add collector/recycler username directly to result
    2. add materialName to result
*/
exports.getSubmissions = ( req, res, next ) => {
  //console.log('get ran');
  let submissions = [];
  let criteria = {};

  if ( req.body.material ) {
    criteria.material = req.body.material;
  }
  if ( req.body.collectorId ) {
    criteria.collector = req.body.collectorId;
  }
  if ( req.body.recyclerId ) {
    criteria.recycler = req.body.recyclerId;
  }
  if ( req.body.status ) {
    criteria.status = req.body.status;
  }

  console.log(criteria);
  Submission
    .find( criteria )
    .populate( 'collector' ).populate( 'recycler' ).populate( 'material' )
    .then( result => {
      //console.log(result);

      let submissions = [];
      for ( let sub of result ) {
        sub = sub.toObject();
        sub.collectorFullName = sub.collector.fullName;
        sub.collectorUsername = sub.collector.username;
        sub.recyclerFullName = sub.recycler.fullName;
        sub.recyclerUsername = sub.recycler.username;
        sub.materialID = sub.material.materiID;
        sub.materialName = sub.material.materialName;

        sub.collector = sub.collector._id;
        sub.recycler = sub.recycler._id;
        sub.material = sub.material._id;
        submissions.push(sub);
      }
      res.status(201).json(submissions);
    })

  /*Submission
    .find( criteria )
    .then( result => {
      submissions = [];
      let last = result.length - 1;
      for ( let i = 0; i < result.length; i++ ) {
        submissions.push(result[i].toObject());
        //submissions[i].materialID = materialID;
        //submissions[i].materialName = materialName;
        User.find( { _id: submissions[i].collectorId } ).then( result => {
          submissions[i].collectorFullName = result[0].fullName;
          submissions[i].collectorUsername = result[0].username;
          User.find( { _id: submissions[i].recyclerId } ).then( result => {
            submissions[i].recyclerFullName = result[0].fullName;
            submissions[i].recyclerUsername = result[0].username;
            Material.find( { _id: submissions[i].materialType } ).then( result => {
              //let materialID = result[0].materialID;
              //let materialName = result[0].materialName;
              submissions[i].materialID = result[0].materialID;
              submissions[i].materialName = result[0].materialName;
              if ( i == last ) {
                //add a intergrity checker here
                res.status(201).json(submissions);
              }
            });
          });
        });
      }
    });*/
}


exports.updateSubmission = ( req, res, next ) => {
  console.log('reached update');
  //  console.log(req.body.submission);
  let submission = Object.assign({}, req.body.submission);
  delete submission._id;
  let material;
  Material
    .find({_id: submission.material}, {pointsPerKg:1}).then( result => {
      submission.pointsAwarded = Math.round((Number(result[0].pointsPerKg) * Number(submission.weightInKg))*100)/100;
      //console.log(submission);
      Submission.updateOne({_id: req.body.submission._id}, submission )
      .then( result => {
         incrementPoint(submission);
         res.status(200).json({message: 'Submission Updated!'})
       })
      .catch( error => { console.log(error); } );
    });
  //let newSubmission = req.body.submission.slice();
  //Submission.update(req.body.submission).then( result=>{console.log(result)});
}


/*
Submission.find({},{submissionID:1}).sort('-submissionID').limit(1).then( result => {
  console.log(result);
  submission.submissionID = "S"+  ("000000" + (Number(result[0].submissionID.slice(-6)) + 1)).slice(-6);
  console.log(submission);
  //console.log(material);
  //submission.save().then() ;
})

*/

exports.addSubmission = ( req, res, next ) => {

  let submission = new Submission({
    submissionID: "S"+('000000'+1).slice(-6),
    proposedDate: req.body.submission.proposedDate,
    actualDate: req.body.submission.actualDate,
    weightInKg: req.body.submission.weightInKg,
    material: req.body.submission.material,
    pointsAwarded:0,
    status: req.body.submission.status,
    recycler: req.body.submission.recycler,
    collector: req.body.submission.collector
  });
  //console.log(submission);

  Material
    .find({_id: submission.material}, {pointsPerKg:1}).then( result => {
      submission.pointsAwarded = Math.round((Number(result[0].pointsPerKg) * Number(submission.weightInKg))*100)/100;
      Submission.find({},{submissionID:1}).sort('-submissionID').limit(1).then( result => {
        submission.submissionID = "S"+  ("000000" + (Number(result[0].submissionID.slice(-6)) + 1)).slice(-6);
        console.log(submission);
        submission.save().then( result => {
          //console.log(submission);
          incrementPoint(submission);
          res.status(200).json({message: 'Submission added!'});
          //User.updateOne({ _id: submission.collector },{ $inc:{totalPoints:submission.pointsAwarded}});
          //User.updateOne({ _id: submission.recycler },{ $inc:{totalPoints:submission.pointsAwarded}});
        });
      })
    });
}

function incrementPoint(submission) {
  console.log('increment ran');
  //console.log(submission);
  //let pointToBeAdded = Math.round((Number(submission.pointsAwarded))*100)/100;
  User.updateOne({ _id: submission.collector },{ $inc:{totalPoints:submission.pointsAwarded}}).then( result => { console.log(result);});
  User.updateOne({ _id: submission.recycler },{ $inc:{totalPoints:submission.pointsAwarded}}).then( result => {
    User.find({_id: submission.recycler}, {totalPoints:1}).then( result => {
      let totalPoints = result[0].totalPoints;
      console.log("totalPoints: " + totalPoints);
      let ecoLevel;
      if ( totalPoints >= 1000 ) {
        ecoLevel = 'Eco Warior';
      } else if ( totalPoints >= 500 ) {
        ecoLevel = 'Eco Hero';
      } else if ( totalPoints >= 100 ) {
        ecoLevel = 'Eco Saver';
      } else {
        ecoLevel = 'Newbie';
      }
      User.updateOne({_id: submission.recycler}, {ecoLevel: ecoLevel}).then();
    })
  });
}



 exports.generateDummySub = ( req, res, next ) => {
   console.log('generate dummy sub ran');
   Submission.deleteMany( { status: "Submitted" } ).then();
   Submission.deleteMany( { status: "Proposed" } ).then();/*.then( result => {

     console.log(result);
   });*/
   let genID = 0;
   for ( let i = 0; i < 3; i++ ) {
     let submission = new Submission({
       submissionID: "S"+('000000'+genID++).slice(-6),
       proposedDate: '2020/03/15',
       actualDate: '2020/03/16',
       weightInKg: 0+i,
       material: '5e6717329d4a704b408a51e9',
       pointsAwarded: 0+i,
       status: 'Submitted',
       recycler: '5e66cb0f8b6bee9aa6143257',
       collector: '5e66cbb48b6bee9aa6143258'
     });

     submission.save().then();
   }

   for ( let i = 0; i < 2; i++ ) {
     let submission = new Submission({
       submissionID: "S"+('000000'+genID++).slice(-6),
       proposedDate: '2020/03/15',
       actualDate: '2020/03/1' + i.toString(),
       weightInKg: 0+i,
       material: '5e671b519d4a704b408a51eb',
       pointsAwarded: 0+i,
       status: 'Submitted',
       recycler: '5e66cb0f8b6bee9aa6143257',
       collector: '5e66cbb48b6bee9aa6143258'
     });

     submission.save().then();
   }

   for ( let i = 0; i < 2; i++ ) {
     let submission = new Submission({
       submissionID: "S"+('000000'+genID++).slice(-6),
       proposedDate: '2020/03/18',
       actualDate: null,
       weightInKg: null,
       material: '5e671b519d4a704b408a51eb',
       pointsAwarded: null,
       status: 'Proposed',
       recycler: '5e66cb0f8b6bee9aa6143257',
       collector: '5e66cbb48b6bee9aa6143258'
     });

     submission.save().then();
   }



   //add a different recycler's appointment for collector
   let submission = new Submission({
     submissionID: "S"+('000000'+genID++).slice(-6),
     proposedDate: '2020/03/18',
     actualDate: null,
     weightInKg: null,
     material: '5e671b519d4a704b408a51eb',
     pointsAwarded: null,
     status: 'Proposed',
     recycler: '5e722bc9a18e9c374cfb69be',
     collector: '5e66cbb48b6bee9aa6143258'
   });

   submission.save().then();




   for ( let i = 0; i < 3; i++ ) {
     let submission = new Submission({
       submissionID: "S"+('000000'+genID++).slice(-6),
       proposedDate: '2020/03/15',
       actualDate: '2020/03/19',
       weightInKg: 0+i,
       material: '5e671a009d4a704b408a51ea',
       pointsAwarded: 0+i,
       status: 'Submitted',
       recycler: '5e722bc9a18e9c374cfb69be',
       collector: '5e722beca18e9c374cfb69bf'
     });

     submission.save().then();
   }

   for ( let i = 0; i < 2; i++ ) {
     let submission = new Submission({
       submissionID: "S"+('000000'+genID++).slice(-6),
       proposedDate: '2020/03/15',
       actualDate: '2020/04/01',
       weightInKg: 0+i,
       material: '5e671b519d4a704b408a51eb',
       pointsAwarded: 0+i,
       status: 'Submitted',
       recycler: '5e722bc9a18e9c374cfb69be',
       collector: '5e722beca18e9c374cfb69bf'
     });

     submission.save().then();
   }

   for ( let i = 0; i < 2; i++ ) {
     let submission = new Submission({
       submissionID: "S"+('000000'+genID++).slice(-6),
       proposedDate: '2020/03/15',
       actualDate: null,
       weightInKg: null,
       material: '5e671b519d4a704b408a51eb',
       pointsAwarded: null,
       status: 'Proposed',
       recycler: '5e722bc9a18e9c374cfb69be',
       collector: '5e722beca18e9c374cfb69bf'
     });

     submission.save().then();
   }
 }
