let Assignment = require('../model/assignment');
let MongoDB = require('mongodb')

// Récupérer tous les assignments (GET)
function getAssignments(req, res) {
    Assignment.find((err, assignments) => {
        if (err) {
            res.send(err)
        }
        res.send(assignments);
    });
}

// Récupérer un assignment par son id (GET)
function getAssignment(req, res) {
    let assignmentId = req.params.id;
    Assignment.findOne({ "_id": MongoDB.ObjectId(assignmentId) }, (err, assignment) => {
        if (err) {
            res.send(err)
        }
        else if (assignment === null) {
            res.json({ error: 'Assignement not found.' })
        }
        else {
            res.send(assignment)
        }
    })
}

// Ajout d'un assignment (POST)
function postAssignment(req, res) {
    let assignment = new Assignment();
    // assignment.id = req.body.id;
    assignment.nom = req.body.nom;
    assignment.professeur = req.body.professeur;
    assignment.dateDeRendu = req.body.dateDeRendu;
    assignment.statut = req.body.statut;
    assignment.description = req.body.description;
    assignment.subject = req.body.subject;

    console.log("POST assignment reçu :", assignment);

    assignment.save((err) => {
        if (err) {
            res.json({ error: 'Cannot post assignment' })
        }
        res.json({ message: `${assignment.nom} saved!` })
    })
}

// Update d'un assignment (PUT)
function updateAssignment(req, res) {
    console.log("UPDATE : ");
    Assignment.findByIdAndUpdate(req.body._id, req.body, (err, assignment) => {        
        if (err) {
            console.log("error", err)
            res.json({ error: err })
        }
        else if (assignment === null) {
            res.json({ error: 'Assignment not found.' })
        } else {
            res.json({ message: 'Assignment updated.' })
        }

    });

}

// suppression d'un assignment (DELETE)
function deleteAssignment(req, res) {
    Assignment.findByIdAndRemove(req.params.id, (err, assignment) => {
        console.log("---- ", assignment)
        if (err) {
            res.json({ error: 'Assignement not found.' })
        } else if (assignment === null) {
            res.json({ error: 'Assignement not found.' })
        }
        else if (assignment === undefined) {
            res.json({ error: 'Assignement not found.' })
        }
        else {
            res.json({ message: `${assignment.nom} deleted.` });
        }
    })
}
module.exports = { getAssignments, postAssignment, getAssignment, updateAssignment, deleteAssignment };
