let User = require('../model/user');
let MongoDB = require('mongodb')

let jwt = require('jsonwebtoken');
let bcrypt = require('bcryptjs');
let config = require('../config');

// Création d'un user

function loginUser(req, res) {
    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) return res.status(500).send('Error on the server.');
        if (!user) return res.status(404).send('No user found.');

        let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

        let token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });

        res.status(200).send({
            user: {
                name: user.name,
                lastName: user.lastName,
                email: user.email,
                year: user.year,
            },
            token: token
        });
    });
}

function logoutUser(req, res) {
    res.status(200).send({ auth: false, token: null });
}

function registerUser(req, res) {
    console.log('BODY -----', req.body)
    let hashedPassword = bcrypt.hashSync(req.body.password, 8);
    User.create({
        name: req.body.name,
        lastName: req.body.lastName,
        year: req.body.year,
        email: req.body.email,
        password: hashedPassword,
    },
        function (err, user) {
            if (err) return res.status(500).send("There was a problem adding the information to the database.");
            let token = jwt.sign({ id: user._id }, config.secret, {
                expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({ auth: true, token: token });
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

module.exports = { logoutUser, loginUser, registerUser, getUsers, getUserDetail, deleteUser, updateUser };
