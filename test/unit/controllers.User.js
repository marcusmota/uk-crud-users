const { mockRequest, mockResponse } = require('mock-req-res')
const userController = require("./../../controllers/User");
const userModel = require("./../../models/User");
const mongoose = require("mongoose");
const chai = require("chai");
const faker = require('faker');


mongoose.models = {};
mongoose.modelSchemas = {};

const insertNUsers = async(n) => {
    
    let p = [];

    for(let i=0;i<n;i++){

        const data = {
            givenName : faker.name.firstName(),
            familyName : faker.name.lastName(),
            email : faker.internet.email(),
            created : faker.date.past()
        }

        p.push(new userModel(data).save())
    }

    await Promise.all(p)

    return;

};

describe('controllers/User unit test', () => {

    let res = mockResponse({send : (user) => {
        return user
    }});
    
    let req = mockRequest();

    require("./../../config/db");

    beforeEach( async () => {
        await userModel.deleteMany({});
    });

    describe('Test the user controller methods', async() => {

        describe('getAll method', () => {

            it('it should return an empty array', async () => {

                let users = await userController.getAll(req, res)
                chai.expect(users).to.have.lengthOf(0);

            });

            it('it should return an array with length of 10', async () => {

                const size=10;

                await insertNUsers(size);

                let users = await userController.getAll(req, res)
                chai.expect(users).to.have.lengthOf(size);

            });

        })

        describe('getById method', () => {

            it('it should return the full store user object', async () => {

                const data = {
                    givenName : faker.name.firstName(),
                    familyName : faker.name.lastName(),
                    email : faker.internet.email(),
                    created : faker.date.past()
                }
        
                const userStore = await new userModel(data).save();
                
                req = {
                    params : {
                        id : userStore._id
                    }
                };

                const user = await userController.getById(req, res);

                chai.expect(user.givenName).to.eq(data.givenName);
                chai.expect(user.familyName).to.eq(data.familyName);
                chai.expect(user.email).to.eq(data.email);

            });

            it('it should return a null object', async () => {

                req = {
                    params : {
                        id : "5c815a3d085b098d82b8d1e5"
                    }
                };

                const user = await userController.getById(req, res);

                chai.expect(user).to.eq(null);

            });

        });
        
    });

});