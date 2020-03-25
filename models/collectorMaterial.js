const mongoose = require('mongoose');

const collectorMaterialSchema = mongoose.Schema({
    collectorID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    materialID: { type: mongoose.Schema.Types.ObjectId, ref: "Material", required: true}
});

module.exports = mongoose.model('collectorMaterial', collectorMaterialSchema);
