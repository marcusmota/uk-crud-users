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
    return await userModel.findOneAndUpdate({ _id : id}, user, { new : true});
};

const checkIfEmailExists = async(email) => {
    return (await userModel.countDocuments({ email })) > 0 ? true : false;
};

const checkIfEmailBelongsToUser = async(_id, email) => {
    return await userModel.countDocuments({ _id, email }) > 0 ? true : false;
};

const couldStoreEmailOnUpdate = async(_id, email) => {

    let flag = await checkIfEmailExists(email);

    if(flag){
        flag = await checkIfEmailBelongsToUser(_id, email);
    }

    return flag;
};


module.exports = {
    getAll,
    checkIfEmailBelongsToUser,
    getById,
    storeUser,
    putUserGivenId,
    checkIfEmailExists,
    couldStoreEmailOnUpdate
}