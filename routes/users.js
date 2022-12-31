let User = require('../model/user');
let MongoDB = require('mongodb')
const path = require("path");

const STATUTS_OPTIONS = ['à faire', 'en cours', 'finit', 'rendu',]


// Création d'un user

function registerUser(req, res) {
    User.create({
        name: req.body.name,
        lastName: req.body.lastName,
        year: req.body.year,
        email: req.body.email,
        password: req.body.password,
    },
        function (err, user) {
            if (err) return res.status(500).send("There was a problem adding the information to the database.");
            res.status(200).send(user);
        }
    );
}

function getUsers(req, res) {
    User.find({}, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
}

function getUserDetail(req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send(user);
    });
}

function deleteUser(req, res) {
    User.findByIdAndRemove(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem deleting the user.");
        res.status(200).send("User: " + user.name + " was deleted.");
    });
}
function updateUser(req, res) {
    User.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (err, user) {
        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).send(user);
    });
}

module.exports = { registerUser, getUsers, getUserDetail, deleteUser, updateUser };
