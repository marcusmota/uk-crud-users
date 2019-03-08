const controller = require("./../controllers/User");

module.exports = (app) => {

    app.get('/v1/users', controller.getAll);
    app.get('/v1/user/:id', controller.getById);
    app.post('/v1/user', controller.postUser);
    /* app.put('/v1/user/:id', controller.putUserById);
    app.delete('/v1/user/:id', controller.deleteUserById); */
  
};