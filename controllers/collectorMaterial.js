//const bcrypt = require("bcrypt");
//const jwt = require("jsonwebtoken");
//const User = require("../models/user");
//const Schedule = require("../models/schedule");
const CollectorMaterial = require("../models/collectorMaterial");
const Material = require("../models/material")


exports.saveMaterials = ( req, res, next ) => {
  let userID = req.body.userId;
  let materials = req.body.materials;
  let selectedMaterial = [];

  CollectorMaterial
    .deleteMany({collectorID: userID })
    .then( result => {
      for ( let i=0; i< materials.length; i++ ) {
        if ( materials[i].selected == true ) {
          selectedMaterial.push(materials[i]);
        }
      }
      if ( selectedMaterial.length != 0 ) {
        for ( let y=0; y<selectedMaterial.length; y++ ) {
          let collectorMaterial = new CollectorMaterial({
            collectorID: userID,
            materialID: selectedMaterial[y]._id
          });
          collectorMaterial.save().then( result => {
            if ( y == (selectedMaterial.length - 1) ) {
              res.status(201).json({
                message: 'material saved'
              });
            }
          });
        }
      } else {
        res.status(201).json({
          message: 'no material saved'
        });
      }
    })
}


exports.getMaterials = ( req, res, next ) => {
  let materials = [];
  CollectorMaterial
    .find({collectorID: req.body.userID})
    .then( result => {
      let last = result.length-1;
      for( let i=0; i<result.length; i++ ) {
        Material
          .findOne({_id:result[i].materialID})
          .then( result => {
            materials.push(result);
            if ( i == last ) {
              res.status(201).json({
                message: 'material fetched',
                materials: materials
              });
            }
          })
      }
      if ( result.length == 0 ) {
        res.status(201).json({
          message: 'no material found',
          materials: []
        })
      }
    });
}


exports.getCollectors = ( req, res, next ) => {
  let collector = [];
  CollectorMaterial
    .find({materialID: req.body.materialId}).populate('collectorID').populate('materialID')
    .then( result => {
      //console.log(result);
      for ( let col of result ) {
        col = col.toObject();
        col.collectorUsername = col.collectorID.username;
        col.collectorFullName = col.collectorID.fullName;
        col.collectorAddress = col.collectorID.address;
        col.material = col.materialID.materialID;
        col.materialName = col.materialID.materialName;
        col.collectorID = col.collectorID._id;
        col.materialID = col.materialID._id;
        collector.push(col);
      }
      res.status(201).json(collector);
    })
}
