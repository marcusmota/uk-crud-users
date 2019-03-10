
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


describe('repositories/User unit test', () => {

    require("./../../config/db");

    beforeEach( async () => {
        await userModel.deleteMany({});
    });

    describe('Test the repository user methods', async() => {

        describe('getAll method', () => {

            it('it should return an empty array', async () => {

                let users = await userRepository.getAll()
                chai.expect(users).to.have.lengthOf(0);

            });

            it('it should return an array with length of 10', async () => {

                const size=10;

                await insertNUsers(size);

                let users = await userRepository.getAll()
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
                
                const user = await userRepository.getById(userStore._id);

                chai.expect(user.givenName).to.eq(data.givenName);
                chai.expect(user.familyName).to.eq(data.familyName);
                chai.expect(user.email).to.eq(data.email);

            });

            it('it should return a null object', async () => {

                const user = await userRepository.getById("5c815a3d085b098d82b8d1e5");

                chai.expect(user).to.eq(null);

            });

        });

        describe('storeUser method', () => {

            it('it should return the stored user object', async () => {

                const data = {
                    givenName : faker.name.firstName(),
                    familyName : faker.name.lastName(),
                    email : faker.internet.email(),
                    created : faker.date.past()
                }
        
                const user = await userRepository.storeUser(data);

                chai.expect(user.givenName).to.eq(data.givenName);
                chai.expect(user.familyName).to.eq(data.familyName);
                chai.expect(user.email).to.eq(data.email);

            });

        });

        describe('putUserGivenId method', () => {

            it('it should return the updated user object', async () => {

                const data = {
                    givenName : faker.name.firstName(),
                    familyName : faker.name.lastName(),
                    email : faker.internet.email(),
                    created : faker.date.past()
                }
        
                const userStore = await new userModel(data).save();

                const newData = {
                    givenName : "GIVENNAME",
                    email : "name@name.com",
                    familyName : "FAMILYNAME",
                }

                const updated = await userRepository.putUserGivenId(userStore._id, newData);

                chai.expect(updated.email).to.eq(newData.email);
                chai.expect(updated.familyName).to.eq(newData.familyName);
                chai.expect(updated.givenName).to.eq(newData.givenName);

            });

        });

        describe('Custom Validators Methods', () => {

            describe('checkIfEmailExistsOnCreate Methods', () => {

                it('it should return true for a given user', async () => {

                    const data = {
                        givenName : faker.name.firstName(),
                        familyName : faker.name.lastName(),
                        email : faker.internet.email(),
                        created : faker.date.past()
                    }
            
                    await new userModel(data).save();

                    const flag = await userRepository.checkIfEmailExists(data.email);

                    chai.expect(flag).to.eq(true);

                });

                it('it should return false for a given user', async () => {

                    const flag = await userRepository.checkIfEmailExists("newemail@email.com");

                    chai.expect(flag).to.eq(false);

                });
            })

            describe('checkIfEmailBelongsToUser Methods', () => {

                it('it should return true for a given user', async () => {

                    const data = {
                        givenName : faker.name.firstName(),
                        familyName : faker.name.lastName(),
                        email : faker.internet.email(),
                        created : faker.date.past()
                    }
            
                    const user = await new userModel(data).save();

                    const flag = await userRepository.checkIfEmailBelongsToUser(user._id, data.email);

                    chai.expect(flag).to.eq(true);

                });

                it('it should return false for a given user', async () => {

                    const data = {
                        givenName : faker.name.firstName(),
                        familyName : faker.name.lastName(),
                        email : faker.internet.email(),
                        created : faker.date.past()
                    }
            
                    const user = await new userModel(data).save();

                    const flag = await userRepository.checkIfEmailBelongsToUser(user._id, "newemail@email.com");

                    chai.expect(flag).to.eq(false);

                });
            })

        });
        
        describe('deleteUserById method', () => {

            it("it should delete a given user by ID", async () => {
                
                const data = {
                    givenName : faker.name.firstName(),
                    familyName : faker.name.lastName(),
                    email : faker.internet.email(),
                    created : faker.date.past()
                }
        
                const user = await new userModel(data).save();

                const deleted = await userRepository.deleteUserById(user._id);

                const checkDeleted = await userRepository.getById(deleted._id);

                chai.expect(deleted.email).to.eq(data.email);
                chai.expect(deleted.familyName).to.eq(data.familyName);
                chai.expect(deleted.givenName).to.eq(data.givenName);
                chai.expect(checkDeleted).to.eq(null);

            })

        })
        
    });

    

});