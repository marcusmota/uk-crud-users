const userModel = require("./../models/User")

const getAll = (req) => {

    return userModel.find({});

};

module.exports = {
    getAll
}