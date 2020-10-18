//References: https://blog.bitsrc.io/build-a-login-auth-app-with-mern-stack-part-1-c405048e3669
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Users = require("../models/User");
const jwt = require("jsonwebtoken");

exports.register = (req, res) => {

    const schema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        email: Joi.string().trim().email().required(),
        password: Joi.string().min(6).max(16).pattern(/^[a-zA-Z0-9]{3,30}$/).required(),
        zipcode: Joi.string().max(5)
    });

    if (!req.session.isLoggedIn) {
        const { error, value } = schema.validate
            ({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                restaurantname: req.body.restaurantname,
                zipcode: req.body.zipcode
            });
        if (error) {
            throw error;
        } else {
            Users.findOne({ email: req.body.email }).then(user => {
                if (user) {
                    console.log('Email already exists!');
                    res.status(400).json("Email already exists!");
                } else {
                    const newUser = new Users({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password,
                        restaurantname: req.body.restaurantname,
                        cuisine: req.body.cuisine,
                        zipcode: req.body.zipcode,
                        owner: req.body.owner
                    });

                    bcrypt.hash(newUser.password, saltRounds, function (err, hash) {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(() => res.json('Registered!'))
                            .catch(err => res.status(400).json('Error: ' + err))
                    });
                    console.log(newUser);
                }
            });
        }
    } else {
        return res.status(400).json("Please logout first to register!");
    }
};

exports.login = (req, res) => {

    const schema = Joi.object({
        email: Joi.string().lowercase().trim().email().required(),
        password: Joi.string().min(6).max(16).pattern(/^[a-zA-Z0-9]{3,30}$/).required()
    });

    //once validated, query user credential and validate against hash password w/ bcrypt and jwt
    const { error, value } = schema.validate({ email: req.body.email, password: req.body.password });
    if (error) {
        throw error;
    } else {
        Users.findOne({ email: req.body.email }).then(user => {
            if (!user) return res.status(404).json('Email does not exist!');
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
                    req.session.ID = user.id;
                    req.session.isLoggedIn = true;
                    res.writeHead(200, { 'Content-Type': 'text/plain' })
                    res.end("Successful Login!");
                } else {
                    return res.status(400).send('Incorrect password!');
                }
            });
        });
    }
};

exports.updateProfile = (req, res) => {

    Users.findByIdAndUpdate(req.session.ID, req.body, (err, user) => {
        if (err) throw err;
        res.status(200).send("Updated profile successfully!");
    });
};

exports.logout = (req, res) => {
    req.session.isLoggedIn = false;
    req.session.ID = null;
    res.sendStatus(200);
};