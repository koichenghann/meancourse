const mongoose = require('mongoose');

const submissionSchema = mongoose.Schema({
    submissionID: { type: String, required: true },
    proposedDate: { type: String },
    actualDate: { type: String },
    material: { type: mongoose.Schema.Types.ObjectId, ref: "Material", required: true },
    weightInKg: { type: Number },
    pointsAwarded: { type: Number },
    status: { type: String, required: true },
    recycler: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    collector: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model('Submission', submissionSchema);
