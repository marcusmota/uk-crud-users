
const userRepository = require("./../../repositories/User");
const userModel = require("./../../models/User");
const mongoose = require("mongoose");
const chai = require("chai");
const faker = require('faker');

mongoose.models = {};
mongoose.modelSchemas = {};

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
                        email : faker.internet.email().toLowerCase(),
                        created : faker.date.past()
                    }
            
                    const user = await new userModel(data).save();

                    const flag = await userRepository.couldStoreEmailOnUpdate(user._id, data.email);

                    chai.expect(flag).to.eq(true);

                });

                it('it should return false for a given user', async () => {

                    const data = {
                        givenName : faker.name.firstName(),
                        familyName : faker.name.lastName(),
                        email : faker.internet.email().toLowerCase(),
                        created : faker.date.past()
                    }
            
                    const user = await new userModel(data).save();

                    const data2 = {
                        givenName : faker.name.firstName(),
                        familyName : faker.name.lastName(),
                        email : faker.internet.email().toLowerCase(),
                        created : faker.date.past()
                    }
            
                    const user2 = await new userModel(data2).save();

                    const flag = await userRepository.couldStoreEmailOnUpdate(user2._id, user.email);

                    chai.expect(flag).to.eq(false);

                });

                it('it should return true for a given user', async () => {

                    const flag = await userRepository.couldStoreEmailOnUpdate("5c81911bc86073004ed52f30", "newemail@email.com");

                    chai.expect(flag).to.eq(true);

                });
            })

            describe('couldStoreEmailOnCreate Methods', () => {

                it('it should return false for a given user', async () => {

                    const data = {
                        givenName : faker.name.firstName(),
                        familyName : faker.name.lastName(),
                        email : faker.internet.email().toLowerCase(),
                        created : faker.date.past()
                    }
            
                    await new userModel(data).save();

                    const flag = await userRepository.couldStoreEmailOnCreate(data.email);

                    chai.expect(flag).to.eq(false);

                });

                it('it should return true for a given user', async () => {

                    const flag = await userRepository.couldStoreEmailOnCreate("newemail@email.com");

                    chai.expect(flag).to.eq(true);

                });
            })

        });

        
    });

    

});