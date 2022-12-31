let Assignment = require('../model/assignment');
let MongoDB = require('mongodb')
const path = require("path");

const STATUTS_OPTIONS = ['à faire', 'en cours', 'finit', 'rendu',]

// Récupérer tous les assignments (GET)
async function getAssignments(req, res) {
    try {
        // pagination
        let page = parseInt(req.query.page) - 1 || 0
        let limit = parseInt(req.query.pageSize) || 10
        // filering
        let searchAssignment = req.query.nom || ""
        let searchProfesseur = req.query.professeur || ""
        let statuts = req.query.statuts || 'All'

        statuts === 'All' ? (statuts = [...STATUTS_OPTIONS]) : (statuts = req.query.statuts.split(","))
        console.log('statuts', statuts)
        const assignments = await Assignment.find({
            nom: {
                $regex: searchAssignment,
                $options: 'i'
            },
            professeur: {
                $regex: searchProfesseur,
                $options: 'i'
            }
        })
            .where('statut')
            .in([...statuts])
            .skip(page * limit)
            .limit(limit)
        const total = await Assignment.countDocuments({
            statut: { $in: [...STATUTS_OPTIONS] },
            nom: { $regex: searchAssignment, $options: 'i' },
            professeur: { $regex: searchProfesseur, $options: 'i' },
        })
        const response = {
            error: false,
            total,
            page: page + 1,
            limit,
            assignments
        }
        res.status(200).json(response)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: true, message: 'Internal Server Error' })
    }

}

// Récupérer un assignment par son id (GET)
function getAssignment(req, res) {
    let assignmentId = req.params.id;
    Assignment.findOne({ "_id": MongoDB.ObjectId(assignmentId) }, (err, assignment) => {
        if (err) {
            res.send(err)
        }
        else if (assignment === null) {
            res.status(400).json({ error: 'Assignement not found.' })
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
