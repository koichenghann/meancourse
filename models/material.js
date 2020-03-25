const mongoose = require('mongoose');

const materialSchema = mongoose.Schema({
    materialID: { type: String },
    materialName:  { type: String },
    description:  { type: String },
    pointsPerKg: { type: String }

});

module.exports = mongoose.model('Material', materialSchema);
