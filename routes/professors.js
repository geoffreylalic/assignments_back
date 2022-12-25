let Assignment = require('../model/assignment');
let MongoDB = require('mongodb')

// Récupérer tous les professeurs (GET)
function getProfessors(req, res) {
    res.send(['Blandel', 'Buffa', 'Cabrio', 'Sauvage', 'Tounsi', 'Winter'])
}


module.exports = { getProfessors };
