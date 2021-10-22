const mongoose = require('mongoose');
const faker = require('faker');
const userRepository = require('../../repositories/user');
const userModel = require('../../models/User');

mongoose.models = {};
mongoose.modelSchemas = {};

describe('repositories/User Integration test', () => {
  require('../../config/db');

  beforeEach(async () => {
    await userModel.deleteMany({});
  });

  describe('Test the repository user methods', () => {
    describe('Custom Validators Methods', () => {
      describe('couldStoreEmailOnUpdate Methods', () => {
        it('it should return true for a given user', async () => {
          const data = {
            givenName: faker.name.firstName(),
            familyName: faker.name.lastName(),
            email: faker.internet.email().toLowerCase(),
            created: faker.date.past(),
          };

          const user = await new userModel(data).save();

          const flag = await userRepository.couldStoreEmailOnUpdate(user._id, data.email);

          expect(flag).toBe(true);
        });

        it('it should return false for a given user', async () => {
          const data = {
            givenName: faker.name.firstName(),
            familyName: faker.name.lastName(),
            email: faker.internet.email().toLowerCase(),
            created: faker.date.past(),
          };

          const user = await new userModel(data).save();

          const data2 = {
            givenName: faker.name.firstName(),
            familyName: faker.name.lastName(),
            email: faker.internet.email().toLowerCase(),
            created: faker.date.past(),
          };

          const user2 = await new userModel(data2).save();

          const flag = await userRepository.couldStoreEmailOnUpdate(user2._id, user.email);

          expect(flag).toBe(false);
        });

        it('it should return true for a given user', async () => {
          const flag = await userRepository.couldStoreEmailOnUpdate('5c81911bc86073004ed52f30', 'newemail@email.com');

          expect(flag).toBe(true);
        });
      });

      describe('couldStoreEmailOnCreate Methods', () => {
        it('it should return false for a given user', async () => {
          const data = {
            givenName: faker.name.firstName(),
            familyName: faker.name.lastName(),
            email: faker.internet.email().toLowerCase(),
            created: faker.date.past(),
          };

          await new userModel(data).save();

          const flag = await userRepository.couldStoreEmailOnCreate(data.email);

          expect(flag).toBe(false);
        });

        it('it should return true for a given user', async () => {
          const flag = await userRepository.couldStoreEmailOnCreate('newemail@email.com');

          expect(flag).toBe(true);
        });
      });
    });
  });
});
