const userRepository = require("./../repositories/User")
const { check, validationResult } = require('express-validator/check');

const getAll = async(req, res) => {

    const users = await userRepository.getAll();

    return res.send(users);

};

const getById = async(req, res) => {

    const user = await userRepository.getById(req.params.id);

    return res.send(user);

};

const parseArrayToObject = (arr = []) => {

    const obj = {};

    arr.forEach(el => {
        obj[el.param] = el.msg
    });

    return obj;

};

const postUser = async(req, res) => {
    
    req.assert('givenName').notEmpty()
    req.assert('familyName').notEmpty()
    req.assert('email').notEmpty()

    errors = req.validationErrors();

    if (errors) {
        return res.status(422).send(parseArrayToObject(errors));
    }

    const user = await userRepository.storeUser(req.body);

    return res.send(user);

};

module.exports = {
    getAll,
    getById,
    postUser
}