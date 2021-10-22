const userModel = require('../models/user');

const getAll = (where = {}, limit = 20, skip = 0) => userModel.find(where).skip(skip).limit(limit);

const deleteUserById = (id) => userModel.findOneAndDelete({ _id: id });

const getById = (id) => userModel.findOne({ _id: id });

const storeUser = (user) => {
  delete user._id;
  delete user.created;
  return new userModel(user).save();
};

const putUserGivenId = async (id, user) => {
  delete user._id;
  delete user.created;
  return userModel.findOneAndUpdate({ _id: id }, user, { new: true });
};

const checkIfEmailExists = async (email) => (await userModel.countDocuments({ email })) > 0;

const checkIfEmailBelongsToUser = async (_id, email) => (await userModel.countDocuments({ _id, email })) > 0;

const couldStoreEmailOnCreate = async (email) => !(await checkIfEmailExists(email));

const couldStoreEmailOnUpdate = async (_id, email) => {
  const flag = await checkIfEmailExists(email);

  if (flag) {
    return checkIfEmailBelongsToUser(_id, email);
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
  deleteUserById,
};
