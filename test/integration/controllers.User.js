
let faker = require('faker');
faker.locale = "pt_BR";
const chai = require('chai');
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

        const skip = 8;

        it(`should return 200 with an array of ${size-skip} elements`, async () => {

            await insertNUsers(size);

            const result = await request
            .get(`/v1/users?skip=${skip}`)
            .set('Accept', /application\/json/)

            chai.expect(result.status).to.eql(200);
            chai.expect(result.body).to.be.an('array')
            chai.expect(result.body).to.have.length(size-skip);

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

        it('should return 200 with the stored user object and different _id (avoid to user set its _id)', async() => {

            const data = {
                givenName : faker.name.firstName(),
                familyName : faker.name.lastName(),
                email : faker.internet.email(),
                _id : "5c83c214d729d246f23bf041"
            }

            const result = await request
            .post(`/v1/user`)
            .send(data)
            .set('Accept', /application\/json/)

            chai.expect(result.status).to.eql(200);
            chai.expect(result.body._id).to.not.eql(data._id);
            chai.expect(result.body.givenName).to.eql(data.givenName);
            chai.expect(result.body.familyName).to.eql(data.familyName);
            chai.expect(result.body.email).to.eql(data.email);


        });

        it('should return 422 with error object that contains just email property', async() => {

            const data = {
                givenName : faker.name.firstName(),
                familyName : faker.name.lastName(),
                email : faker.internet.email(),
                created : faker.date.past()
            }

            await new userModel(data).save();

            const result = await request
            .post(`/v1/user`)
            .send(data)
            .set('Accept', /application\/json/)

            chai.expect(result.status).to.eql(422);
            chai.expect(result.body).to.have.property("email");
            chai.expect(result.body).to.not.have.property("givenName");
            chai.expect(result.body).to.not.have.property("familyName");

        });

        it('should return 422 with error object that contains givenName, familyName and email property', async() => {

            const data = {
            }

            const result = await request
            .post(`/v1/user`)
            .send(data)
            .set('Accept', /application\/json/)

            chai.expect(result.status).to.eql(422);
            chai.expect(result.body).to.have.property("email");
            chai.expect(result.body).to.have.property("givenName");
            chai.expect(result.body).to.have.property("familyName");

        });

    });

    describe('PUT /v1/user/:id', () => {

        let user, user2;

        beforeEach(async() => {
            const data = {
                givenName : faker.name.firstName(),
                familyName : faker.name.lastName(),
                email : faker.internet.email(),
                created : faker.date.past()
            }
            const data2 = {
                givenName : faker.name.firstName(),
                familyName : faker.name.lastName(),
                email : faker.internet.email(),
                created : faker.date.past()
            }
            user = await new userModel(data).save();
            user2 = await new userModel(data2).save();
        });

        it('should return 200 with the stored user object', async() => {

            const dataNew = {
                givenName : faker.name.firstName(),
                familyName : faker.name.lastName(),
                email : faker.internet.email(),
                created : faker.date.past()
            }

            const result = await request
            .put(`/v1/user/${user._id}`)
            .send(dataNew)
            .set('Accept', /application\/json/)

            chai.expect(result.status).to.eql(200);
            chai.expect(result.body.givenName).to.eql(dataNew.givenName);
            chai.expect(result.body.familyName).to.eql(dataNew.familyName);
            chai.expect(result.body.email).to.eql(dataNew.email);

        });

        it('should return 200 with the same _id of user (avoid to user change its _id)', async() => {

            const dataNew = {
                givenName : faker.name.firstName(),
                familyName : faker.name.lastName(),
                email : faker.internet.email(),
                created : faker.date.past(),
                _id : user2._id
            }

            const result = await request
            .put(`/v1/user/${user._id}`)
            .send(dataNew)
            .set('Accept', /application\/json/)

            chai.expect(result.status).to.eql(200);
            chai.expect(result.body._id).to.not.eql(dataNew._id);
            chai.expect(result.body.givenName).to.eql(dataNew.givenName);
            chai.expect(result.body.familyName).to.eql(dataNew.familyName);
            chai.expect(result.body.email).to.eql(dataNew.email);

        });

        it('should return 422 with error object that contains just email property with this message `the email address is already taken`', async() => {

            const data = {
                givenName : faker.name.firstName(),
                familyName : faker.name.lastName(),
                email : user2.email,
                created : faker.date.past()
            }

            const result = await request
            .put(`/v1/user/${user._id}`)
            .send(data)
            .set('Accept', /application\/json/)

            chai.expect(result.status).to.eql(422);
            chai.expect(result.body).to.have.property("email");
            chai.expect(result.body.email).to.eql("the email address is already taken")
            chai.expect(result.body).to.not.have.property("givenName");
            chai.expect(result.body).to.not.have.property("familyName");

        });

        it('should return 422 with error object that contains givenName, familyName and email property', async() => {

            const data = {
            }

            const result = await request
            .put(`/v1/user/${user._id}`)
            .send(data)
            .set('Accept', /application\/json/)

            chai.expect(result.status).to.eql(422);
            chai.expect(result.body).to.have.property("email");
            chai.expect(result.body).to.have.property("givenName");
            chai.expect(result.body).to.have.property("familyName");

        });

    });

    describe('DELETE /v1/user/:id', () => {

        it('should return 200 with the deleted user object', async() => {

            const data = {
                givenName : faker.name.firstName(),
                familyName : faker.name.lastName(),
                email : faker.internet.email(),
                created : faker.date.past()
            }

            user = await new userModel(data).save();

            const result = await request
            .delete(`/v1/user/${user._id}`)
            .set('Accept', /application\/json/)

            chai.expect(result.status).to.eql(200);
            chai.expect(result.body._id).to.not.eql(data._id);
            chai.expect(result.body.givenName).to.eql(data.givenName);
            chai.expect(result.body.familyName).to.eql(data.familyName);
            chai.expect(result.body.email).to.eql(data.email);


        });

    });

});