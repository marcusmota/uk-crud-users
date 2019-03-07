
const userRepository = require("./../../repositories/User");
const userModel = require("./../../models/User");
const mongoose = require("mongoose");
const chai = require("chai");
const faker = require('faker');

mongoose.models = {};
mongoose.modelSchemas = {};

describe('repository/User unit test', () => {

    require("./../../config/db");

    const fakerUser = {
        givenName : faker.name.firstName(),
        familyName : faker.name.lastName(),
        email : faker.internet.email(),
        created : faker.date.past()
    }

    const fakerUser2 = {
        givenName : faker.name.firstName(),
        familyName : faker.name.lastName(),
        email : faker.internet.email(),
        created : faker.date.past()
    }


    beforeEach(() => {
        userModel.deleteMany({}, () => {
        })
    });

    describe('Test the repository user methods', async() => {

        it('it should return an empty array', async () => {

            let users = await userRepository.getAll()
            chai.expect(users).to.have.lengthOf(0);

        });

        it('it should return an array with length of 2', async () => {

            Promise.all(
                [
                    new userModel(fakerUser).save(),
                    new userModel(fakerUser2).save()
                ])

            let users = await userRepository.getAll()
            chai.expect(users).to.have.lengthOf(2);

        });
        

    });


});