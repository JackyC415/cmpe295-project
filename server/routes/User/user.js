const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const Users = require("../../models/User/User");
const jwt = require("jsonwebtoken");
const saltRounds = 10;

router.post('/register', async (req, res) => {

    const schema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        email: Joi.string().trim().email().required(),
        password: Joi.string().min(6).max(16).pattern(/^[a-zA-Z0-9]{3,30}$/).required(),
        address: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        zipcode: Joi.string().max(5)
    });

    const { error, value } = schema.validate({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zipcode: req.body.zipcode
    });
    if (error) {
        throw error;
    } else {
        Users.findOne({ email: req.body.email }).then(user => {
            if (user) {
                console.log('Email already exists!');
                res.status(400).send('Invalid email!');
            } else {
                const newUser = new Users({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    address: req.body.address,
                    city: req.body.city,
                    state: req.body.state,
                    zipcode: req.body.zipcode
                });

                bcrypt.hash(newUser.password, saltRounds, function (err, hash) {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(() => res.status(200).send('Registered successfully!'))
                        .catch(err => res.status(400).json('Error: ' + err))
                });
                console.log(newUser);
            }
        });
    }
});

router.post('/login', async (req, res) => {

    const schema = Joi.object({
        email: Joi.string().lowercase().trim().email().required(),
        password: Joi.string().min(6).max(16).pattern(/^[a-zA-Z0-9]{3,30}$/).required()
    });

    const { error, value } = schema.validate({ email: req.body.email, password: req.body.password });
    if (error) throw error;
    Users.findOne({ email: req.body.email }).then(user => {
        if (!user) return res.sendStatus(404);
        bcrypt.compare(req.body.password, user.password).then(isMatch => {
            if (isMatch) {
                jwt.sign(
                    { id: user.id }, 'secret', { expiresIn: 3600 },
                    (err, token) => {
                        if (err) throw err;
                        res.json({
                            token,
                            user: {
                                id: user.id,
                                email: user.email
                            }
                        });
                    }
                );
                res.cookie('cookie', "authenticated", { maxAge: 900000, httpOnly: false, path: '/' });
                req.session.ID = user.id;
                req.session.isLoggedIn = true;
                res.writeHead(200, { 'Content-Type': 'text/plain' })
                res.end("Successful Login!");
            } else {
                return res.status(400).send('Incorrect password!');
            }
        });

    });
});

router.post('/logout', async (req, res) => {
    req.session.isLoggedIn = false;
    req.session.ID = null;
    res.sendStatus(200);
});

module.exports = router;
