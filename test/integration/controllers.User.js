
let faker = require('faker');
faker.locale = "pt_BR";
const userModel = require("./../../models/User");
const request = require("supertest");
const app = require("../../app");

const insertNUsers = async(n) => {
    
    let p = [];

    for(let i=0;i<n;i++){

        const data = {
            givenName : faker.name.firstName(),
            familyName : faker.name.lastName(),
            email : faker.internet.email().toLowerCase(),
            created : faker.date.past()
        }

        p.push(new userModel(data).save())
    }

    return await Promise.all(p)

};

describe('controllers/User Integration Test', () => {

    beforeEach( async () => {
        await userModel.deleteMany({});
    });

    describe('GET /v1/users', () => {

        const size = 10;

        it(`should return 200 with an array of ${size} elements`, async () => {

            await insertNUsers(size);

            const result = await request(app)
            .get(`/v1/users`)
            .set('Accept', /application\/json/)

            expect(result.status).toBe(200);
            expect(result.body).toHaveLength(size);

        });

        const skip = 8;

        it(`should return 200 with an array of ${size-skip} elements`, async () => {

            await insertNUsers(size);

            const result = await request(app)
            .get(`/v1/users?skip=${skip}`)
            .set('Accept', /application\/json/)

            expect(result.status).toBe(200);
            expect(result.body).toHaveLength(size-skip);

        });

    });

    describe('POST /v1/user', () => {

        it('should return 200 with the stored user object', async() => {

            const data = {
                givenName : faker.name.firstName(),
                familyName : faker.name.lastName(),
                email : faker.internet.email().toLowerCase(),
                created : faker.date.past()
            }

            const result = await request(app)
            .post(`/v1/user`)
            .send(data)
            .set('Accept', /application\/json/)

            expect(result.status).toBe(200);
            expect(result.body.givenName).toBe(data.givenName);
            expect(result.body.familyName).toBe(data.familyName);
            expect(result.body.email).toBe(data.email);

        });

        it('should return 200 with the stored user object and different _id (avoid to user set its _id)', async() => {

            const data = {
                givenName : faker.name.firstName(),
                familyName : faker.name.lastName(),
                email : faker.internet.email().toLowerCase(),
                _id : "5c83c214d729d246f23bf041"
            }

            const result = await request(app)
            .post(`/v1/user`)
            .send(data)
            .set('Accept', /application\/json/)

            expect(result.status).toBe(200);
            expect(result.body._id).not.toBe(data._id);
            expect(result.body.givenName).toBe(data.givenName);
            expect(result.body.familyName).toBe(data.familyName);
            expect(result.body.email).toBe(data.email);


        });

        it('should return 422 with error object that contains just email property', async() => {

            const data = {
                givenName : faker.name.firstName(),
                familyName : faker.name.lastName(),
                email : faker.internet.email().toLowerCase(),
                created : faker.date.past()
            }

            await new userModel(data).save();

            const result = await request(app)
            .post(`/v1/user`)
            .send(data)
            .set('Accept', /application\/json/)

            expect(result.status).toBe(422);
            expect(result.body).toHaveProperty("email");
            expect(result.body).not.toHaveProperty("givenName");
            expect(result.body).not.toHaveProperty("familyName");

        });

        it('should return 422 with error object that contains givenName, familyName and email property', async() => {

            const data = {
            }

            const result = await request(app)
            .post(`/v1/user`)
            .send(data)
            .set('Accept', /application\/json/)

            expect(result.status).toBe(422);
            expect(result.body).toHaveProperty("email");
            expect(result.body).toHaveProperty("givenName");
            expect(result.body).toHaveProperty("familyName");

        });

    });

    describe('PUT /v1/user/:id', () => {

        let user, user2;

        beforeEach(async() => {
            const data = {
                givenName : faker.name.firstName(),
                familyName : faker.name.lastName(),
                email : faker.internet.email().toLowerCase(),
                created : faker.date.past()
            }
            const data2 = {
                givenName : faker.name.firstName(),
                familyName : faker.name.lastName(),
                email : faker.internet.email().toLowerCase(),
                created : faker.date.past()
            }
            user = await new userModel(data).save();
            user2 = await new userModel(data2).save();
        });

        it('should return 200 with the stored user object', async() => {

            const dataNew = {
                givenName : faker.name.firstName(),
                familyName : faker.name.lastName(),
                email : faker.internet.email().toLowerCase(),
                created : faker.date.past()
            }

            const result = await request(app)
            .put(`/v1/user/${user._id}`)
            .send(dataNew)
            .set('Accept', /application\/json/)

            expect(result.status).toBe(200);
            expect(result.body.givenName).toBe(dataNew.givenName);
            expect(result.body.familyName).toBe(dataNew.familyName);
            expect(result.body.email).toBe(dataNew.email);

        });

        it('should return 200 with the same _id of user (avoid to user change its _id)', async() => {

            const dataNew = {
                givenName : faker.name.firstName(),
                familyName : faker.name.lastName(),
                email : faker.internet.email().toLowerCase(),
                created : faker.date.past(),
                _id : user2._id
            }

            const result = await request(app)
            .put(`/v1/user/${user._id}`)
            .send(dataNew)
            .set('Accept', /application\/json/)

            expect(result.status).toBe(200);
            expect(result.body._id).not.toBe(dataNew._id);
            expect(result.body.givenName).toBe(dataNew.givenName);
            expect(result.body.familyName).toBe(dataNew.familyName);
            expect(result.body.email).toBe(dataNew.email);

        });

        it('should return 422 with error object that contains just email property with this message `the email address is already taken`', async() => {

            const data = {
                givenName : faker.name.firstName(),
                familyName : faker.name.lastName(),
                email : user2.email,
                created : faker.date.past()
            }

            const result = await request(app)
            .put(`/v1/user/${user._id}`)
            .send(data)
            .set('Accept', /application\/json/)

            expect(result.status).toBe(422);
            expect(result.body).toHaveProperty("email");
            expect(result.body.email).toBe("the email address is already taken")
            expect(result.body).not.toHaveProperty("givenName");
            expect(result.body).not.toHaveProperty("familyName");

        });

        it('should return 200 when update a given user with his email', async() => {


            const result = await request(app)
            .put(`/v1/user/${user._id}`)
            .send(user)
            .set('Accept', /application\/json/)

            expect(result.status).toBe(200);
            expect(result.body._id).toBe(user._id);
            expect(result.body.givenName).toBe(user.givenName);
            expect(result.body.familyName).toBe(user.familyName);
            expect(result.body.email).toBe(user.email);

        });

        it('should return 422 with error object that contains givenName, familyName and email property', async() => {

            const data = {
            }

            const result = await request(app)
            .put(`/v1/user/${user._id}`)
            .send(data)
            .set('Accept', /application\/json/)

            expect(result.status).toBe(422);
            expect(result.body).toHaveProperty("email");
            expect(result.body).toHaveProperty("givenName");
            expect(result.body).toHaveProperty("familyName");

        });
        

    });

    describe('DELETE /v1/user/:id', () => {

        it('should return 200 with the deleted user object', async() => {

            const data = {
                givenName : faker.name.firstName(),
                familyName : faker.name.lastName(),
                email : faker.internet.email().toLowerCase(),
                created : faker.date.past()
            }

            const user = await new userModel(data).save();

            const result = await request(app)
            .delete(`/v1/user/${user._id}`)
            .set('Accept', /application\/json/)

            expect(result.status).toBe(200);
            expect(result.body._id).not.toBe(data._id);
            expect(result.body.givenName).toBe(data.givenName);
            expect(result.body.familyName).toBe(data.familyName);
            expect(result.body.email).toBe(data.email);


        });

    });

});