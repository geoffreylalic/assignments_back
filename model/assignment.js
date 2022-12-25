let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let AssignmentSchema = Schema({
    id: Number,
    nom: String,
    professeur: String,
    dateDeRendu: Date,
    nom: String,
    statut: String,
    description: String,
    subject:String,
    created_by:String,
});

// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports = mongoose.model('Assignment', AssignmentSchema);
