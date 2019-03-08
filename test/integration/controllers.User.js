
let faker = require('faker');
faker.locale = "pt_BR";
const chai = require('chai');
const expect = require('chai').expect;
const should = require('chai').should;
const userModel = require("./../../models/User");

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

describe('controllers/User Integration Test', () => {

    beforeEach( async () => {
        await userModel.deleteMany({});
    });

    describe('GET /v1/users', async() => {

        const size = 10;

        it(`should return 200 with an array of ${size} elements`, async () => {

            await insertNUsers(size);

            const result = await request
            .get(`/v1/users`)
            .set('Accept', /application\/json/)

            chai.expect(result.status).to.eql(200);
            chai.expect(result.body).to.be.an('array')
            chai.expect(result.body).to.have.length(size);

        });

    });

    describe('POST /v1/user', () => {

        it('should return 200 with the stored user object', async() => {

            const data = {
                givenName : faker.name.firstName(),
                familyName : faker.name.lastName(),
                email : faker.internet.email(),
                created : faker.date.past()
            }

            const result = await request
            .post(`/v1/user`)
            .send(data)
            .set('Accept', /application\/json/)

            chai.expect(result.status).to.eql(200);
            chai.expect(result.body.givenName).to.eql(data.givenName);
            chai.expect(result.body.familyName).to.eql(data.familyName);
            chai.expect(result.body.email).to.eql(data.email);


        });


    });


});