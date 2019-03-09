const userModel = require("./../models/User")

const getAll = (where = {}, limit = 20, skip = 0) => {
    return userModel.find(where).skip(skip).limit(limit);
};

const deleteUserById = (id) => {
    return userModel.findOneAndDelete({_id : id});
};

const getById = (id) => {
    return userModel.findOne({_id : id});
};

const storeUser = (user) => {
    delete user._id;
    delete user.created;
    return new userModel(user).save();
};

const putUserGivenId = async(id, user) => {
    delete user._id;
    delete user.created;
    return await userModel.findOneAndUpdate({ _id : id}, user, { new : true});
};

const checkIfEmailExists = async(email) => {
    return (await userModel.countDocuments({ email })) > 0 ? true : false;
};

const checkIfEmailBelongsToUser = async(_id, email) => {
    return await userModel.countDocuments({ _id, email }) > 0 ? true : false;
};

const couldStoreEmailOnCreate = async(email) => {

    let flag = await checkIfEmailExists(email);

    return !flag;
};

const couldStoreEmailOnUpdate = async(_id, email) => {

    let flag = await checkIfEmailExists(email);

    if(flag){
        return await checkIfEmailBelongsToUser(_id, email);
    }

    return !flag;

};


module.exports = {
    getAll,
    checkIfEmailBelongsToUser,
    getById,
    storeUser,
    putUserGivenId,
    checkIfEmailExists,
    couldStoreEmailOnCreate,
    couldStoreEmailOnUpdate,
    deleteUserById
}