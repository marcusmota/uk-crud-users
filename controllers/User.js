const userRepository = require("./../repositories/User")

const getAll = async(req, res) => {

    const { limit, skip, givenName, familyName, email } = req.query;

    const obj = {
        where : {},
        limit : parseInt(limit),
        skip : parseInt(skip)
    };

    if(!req.query.limit){
        obj.limit = 20;
    }
    
    if(!req.query.skip){
        obj.skip = 0;
    }

    if(givenName){
        obj.where.givenName = new RegExp(givenName, "ig")
    }

    if(familyName){
        obj.where.familyName = new RegExp(familyName, "ig")
    }
    
    if(email){
        obj.where.email = new RegExp(email, "ig")
    }
    
    const users = await userRepository.getAll(obj.where, obj.limit, obj.skip);

    return res.send(users);

};

const getById = async(req, res) => {

    const user = await userRepository.getById(req.params.id);

    return res.send(user);

};

const deleteUserById = async(req, res) => {

    const user = await userRepository.deleteUserById(req.params.id);

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
    
    req.assert('givenName')
        .isLength({min: 1, max: 100}).withMessage("the given name field is required").trim().escape()
    req.assert('familyName')
        .isLength({min: 1, max: 100}).withMessage("the family name field is required").trim().escape(),
    req.assert('email')
        .isLength({min: 1, max: 100}).withMessage("the email field is required")
        .isEmail().withMessage("you must insert a valid email address")
        .custom(async val => {
            return val && await userRepository.couldStoreEmailOnCreate(val) ? Promise.resolve() : Promise.reject();
        }).withMessage("the email address is already taken").normalizeEmail();
    
    try {
        
        await req.asyncValidationErrors();

        const user = await userRepository.storeUser(req.body);
        return res.send(user);

    }catch(errors){

        return res.status(422).send(parseArrayToObject(errors));

    }

};


const putUserById = async(req, res) => {

    const { id } = req.params;

    req.assert('givenName')
        .isLength({min: 1, max: 100}).withMessage("the given name field is required").trim().escape()
    req.assert('familyName')
        .isLength({min: 1, max: 100}).withMessage("the family name field is required").trim().escape()
    req.assert('email')
        .isLength({min: 1, max: 100}).withMessage("the email field is required")
        .isEmail().withMessage("you must insert a valid email address")
        .custom(async val => {
            return val && await userRepository.couldStoreEmailOnUpdate(id, val) ? Promise.resolve() : Promise.reject();
        }).withMessage("the email address is already taken").normalizeEmail();
    
    try {
        
        await req.asyncValidationErrors();

        const user = await userRepository.putUserGivenId(id, req.body);
        
        return res.send(user);

    }catch(errors){
        
        return res.status(422).send(parseArrayToObject(errors));
   
    }


};

module.exports = {
    getAll,
    getById,
    postUser,
    putUserById,
    deleteUserById
}