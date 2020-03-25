const Material = require("../models/material");





exports.getMaterialsMini = ( req, res, next ) => {
  Material
    .find({},{_id:1, materiaID:1, materialName: 1})
    .then( result => {
      res.status(201).json(result);
    })
}

exports.findMaterial = ( req, res, next ) => {
  Material
    .find({materialName: req.body.materialName})
    .then( result => {
      res.status(201).json(result);
    });
}
//create material
exports.createMaterial = (req, res, next) => {
  const material = new Material({
    materialID  : req.body.materialID,
    materialName:  req.body.materialName,
    description :  req.body.description,
    pointsPerKg : req.body.pointsPerKg
  });
  material
  .save().
  then(result => {
    res.status(201).json({
      message: 'Material created succesfully!',
      result: result
    });
  })
  .catch( err => {
    res.status(500).json({
      message: "Failed to create new Material"
    });
  });
}


//get all Material in database
exports.getMaterials = (req, res, next) => {
  console.log('material ran');
  const materialQuery = Material.find();
  let fetchedMaterial;
  materialQuery
    .then(documents => {
      fetchedMaterial = documents;
      res.status(200).json({
        message: 'Materials fetched succesfully',
        materials: fetchedMaterial
      });
    })
    .catch(err => {
      res.status(500).json({
        message: 'Error occured while retrieving Materials'
      });
    })
}


//get one Material, find  by materialID
exports.getMaterial = (req, res, next) => {
  Material
    .find({materialID: req.params.materialID})
    .then( material => {
      if ( material ) {
        res.status( 200 ).json( material );
      } else {
        res.status( 404 ).json( "Material not found!" );
      }
    })
    .catch( err => {
      res.status(500).json({
        message: "Fetch material failed!"
      });
    });
}


//update Material
exports.updateMaterial = (req, res, next) => {
  console.log('update ran' + req.body.materialID);
  const material  = {
    materialID  : req.body.materialID,
    materialName: req.body.materialName,
    description : req.body.description,
    pointsPerKg : req.body.pointsPerKg
  };
  Material
    .updateOne({ _id: req.body._id }, material )
    .then( result => {
      if ( result.n > 0 ) {
        res.status(200).json({
          message: "Update Succesfull!"
        });
      } else {
        res.status(401).json({
          message: "You are not authorised to update this record, honey."
        });
      }
    })
    .catch( err => {
      res.status( 500 ).json({
        message: "Failed to update material!, error: " + err
      })
    });
}


//delete Material
exports.deleteMaterial = (req, res, next) => {
  console.log('delete ran');
  Material.deleteOne({ _id: req.params._id })
    .then( result => {
      if (result.n > 0) {
        res.status(200).json({message: "Delete Succesfull!"});
      } else {
        res.status(401).json({message: "Not authorized"});
      }
    })
    .catch( err => {
      res.status(500).json({
        message: "Deleting post failed!"
      });
    });
}


//check if material with the privided materialID exist
exports.checkMaterialExist = (req, res, next) => {
  console.log('check material ran');
  Material.find( { materialID: req.params.materialID } )
    .then( material => {
      if ( material ) {
        res.status(200).json({materialFound: material.length, message: 'found'});
      } else {
        res.status(401).json({message: 'not found'});
      }
    })
    .catch( err => {
      res.status(500).json({message: 'Error occured while checking material uniqueness'});
    })
}
