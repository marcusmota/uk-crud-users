const mongoose = require('mongoose');
const faker = require('faker');
const userRepository = require('../../repositories/user');
const userModel = require('../../models/user');

mongoose.models = {};
mongoose.modelSchemas = {};

const insertNUsers = async (n) => {
  const p = [];

  for (let i = 0; i < n; i++) {
    const data = {
      givenName: faker.name.firstName(),
      familyName: faker.name.lastName(),
      email: faker.internet.email(),
      created: faker.date.past(),
    };

    p.push(new userModel(data).save());
  }

  await Promise.all(p);
};

describe('repositories/User unit test', () => {
  require('../../config/db');

  beforeEach(async () => {
    await userModel.deleteMany({});
  });

  describe('Test the repository user methods', () => {
    describe('getAll method', () => {
      it('it should return an empty array', async () => {
        const users = await userRepository.getAll();
        expect(users).toHaveLength(0);
      });

      it('it should return an array with length of 10', async () => {
        const size = 10;

        await insertNUsers(size);

        const users = await userRepository.getAll();
        expect(users).toHaveLength(size);
      });
    });

    describe('getById method', () => {
      it('it should return the full store user object', async () => {
        const data = {
          givenName: faker.name.firstName(),
          familyName: faker.name.lastName(),
          email: faker.internet.email(),
          created: faker.date.past(),
        };

        const userStore = await new userModel(data).save();

        const user = await userRepository.getById(userStore._id);

        expect(user.givenName).toBe(data.givenName);
        expect(user.familyName).toBe(data.familyName);
        expect(user.email).toBe(data.email);
      });

      it('it should return a null object', async () => {
        const user = await userRepository.getById('5c815a3d085b098d82b8d1e5');

        expect(user).toBe(null);
      });
    });

    describe('storeUser method', () => {
      it('it should return the stored user object', async () => {
        const data = {
          givenName: faker.name.firstName(),
          familyName: faker.name.lastName(),
          email: faker.internet.email(),
          created: faker.date.past(),
        };

        const user = await userRepository.storeUser(data);

        expect(user.givenName).toBe(data.givenName);
        expect(user.familyName).toBe(data.familyName);
        expect(user.email).toBe(data.email);
      });
    });

    describe('putUserGivenId method', () => {
      it('it should return the updated user object', async () => {
        const data = {
          givenName: faker.name.firstName(),
          familyName: faker.name.lastName(),
          email: faker.internet.email(),
          created: faker.date.past(),
        };

        const userStore = await new userModel(data).save();

        const newData = {
          givenName: 'GIVENNAME',
          email: 'name@name.com',
          familyName: 'FAMILYNAME',
        };

        const updated = await userRepository.putUserGivenId(userStore._id, newData);

        expect(updated.email).toBe(newData.email);
        expect(updated.familyName).toBe(newData.familyName);
        expect(updated.givenName).toBe(newData.givenName);
      });
    });

    describe('Custom Validators Methods', () => {
      describe('checkIfEmailExistsOnCreate Methods', () => {
        it('it should return true for a given user', async () => {
          const data = {
            givenName: faker.name.firstName(),
            familyName: faker.name.lastName(),
            email: faker.internet.email(),
            created: faker.date.past(),
          };

          await new userModel(data).save();

          const flag = await userRepository.checkIfEmailExists(data.email);

          expect(flag).toBe(true);
        });

        it('it should return false for a given user', async () => {
          const flag = await userRepository.checkIfEmailExists('newemail@email.com');

          expect(flag).toBe(false);
        });
      });

      describe('checkIfEmailBelongsToUser Methods', () => {
        it('it should return true for a given user', async () => {
          const data = {
            givenName: faker.name.firstName(),
            familyName: faker.name.lastName(),
            email: faker.internet.email(),
            created: faker.date.past(),
          };

          const user = await new userModel(data).save();

          const flag = await userRepository.checkIfEmailBelongsToUser(user._id, data.email);

          expect(flag).toBe(true);
        });

        it('it should return false for a given user', async () => {
          const data = {
            givenName: faker.name.firstName(),
            familyName: faker.name.lastName(),
            email: faker.internet.email(),
            created: faker.date.past(),
          };

          const user = await new userModel(data).save();

          const flag = await userRepository.checkIfEmailBelongsToUser(user._id, 'newemail@email.com');

          expect(flag).toBe(false);
        });
      });
    });

    describe('deleteUserById method', () => {
      it('it should delete a given user by ID', async () => {
        const data = {
          givenName: faker.name.firstName(),
          familyName: faker.name.lastName(),
          email: faker.internet.email(),
          created: faker.date.past(),
        };

        const user = await new userModel(data).save();

        const deleted = await userRepository.deleteUserById(user._id);

        const checkDeleted = await userRepository.getById(deleted._id);

        expect(deleted.email).toBe(data.email);
        expect(deleted.familyName).toBe(data.familyName);
        expect(deleted.givenName).toBe(data.givenName);
        expect(checkDeleted).toBe(null);
      });
    });
  });
});
