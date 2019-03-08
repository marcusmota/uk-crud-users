
const userRepository = require("./../../repositories/User");
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


describe('repositories/User Integration test', () => {

    require("./../../config/db");

    beforeEach( async () => {
        await userModel.deleteMany({});
    });

    describe('Test the repository user methods', async() => {

        describe('Custom Validators Methods', () => {

            describe('couldStoreEmailOnUpdate Methods', () => {

                it('it should return true for a given user', async () => {

                    const data = {
                        givenName : faker.name.firstName(),
                        familyName : faker.name.lastName(),
                        email : faker.internet.email(),
                        created : faker.date.past()
                    }
            
                    const user = await new userModel(data).save();

                    const flag = await userRepository.couldStoreEmailOnUpdate(user._id, data.email);

                    chai.expect(flag).to.eq(true);

                });

                it('it should return false for a given user', async () => {

                    const flag = await userRepository.couldStoreEmailOnUpdate("newemail@email.com");

                    chai.expect(flag).to.eq(false);

                });
            })

        });

        
    });

    

});