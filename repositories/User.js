const userModel = require("./../models/User")

const getAll = (req) => {
    return userModel.find({});
};

const getById = (id) => {
    return userModel.findOne({_id : id});
};

const storeUser = (user) => {
    return new userModel(user).save();
};

const putUserGivenId = async(id, user) => {
    return await userModel.findOneAndUpdate({ _id : id}, user, { new : true});;
};

module.exports = {
    getAll,
    getById,
    storeUser,
    putUserGivenId
}