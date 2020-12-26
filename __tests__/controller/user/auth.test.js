const mongoose = require('mongoose');
const request = require("supertest");
const {
  describe,
  expect,
  it,
  afterEach,
  beforeAll,
  afterAll
} = require("@jest/globals");

const User = require("src/model/user");
const app = require("src/app");

const VALID_PHONE_NUMBER = { phone: "71234556789" };
const INVALID_PHONE_NUMBER = { phone: "7889o888788" };

const VALID_REQUEST = { phone: "+71234556789" };
const INVALID_REQUEST = { phone: "+7889o888788" };

const SAVE_PHONE_URL = '/api/users/auth/save-phone';
const IS_VERIFIED_URL = '/api/users/auth/is-verified';

describe('check auth', () => {
  describe('save phone', () => {
    it('saving the new phone', async () => {
      const response = await request(app)
        .post(SAVE_PHONE_URL)
        .send(VALID_REQUEST);

      expect(response.status).toBe(200);
      expect(response.text).toContain("User saved");
    })
    it('trying to save the existing phone', async () => {
      await User.create(VALID_PHONE_NUMBER);

      const response = await request(app)
        .post(SAVE_PHONE_URL)
        .send(VALID_REQUEST);

      expect(response.status).toBe(200);
      expect(response.text).toContain("User exists, continue");
    })
    it('invalid phone number', async () => {
      const response = await request(app)
        .post(SAVE_PHONE_URL)
        .send(INVALID_REQUEST);

      expect(response.status).toBe(400);
      expect(response.text).toContain("Invalid data");
    })
  })

  describe('is phone verified', () => {
    it('phone is verified', async () => {
      await User.create(VALID_PHONE_NUMBER);

      const response = await request(app)
        .post(IS_VERIFIED_URL)
        .send(VALID_REQUEST);

      const json = JSON.parse(response.text);

      expect(response.status).toBe(200);
      expect(json.isVerified).toBe(true);
      expect(json.jwtToken).toContain("Bearer");
    })
    it('user with the phone does not exist', async () => {
      const response = await request(app)
        .post(IS_VERIFIED_URL)
        .send(VALID_REQUEST);

      expect(response.status).toBe(400);
      expect(response.text).toContain("User does not exist");
    })
  })

  beforeAll(async () =>
    await mongoose.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }, (err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    }));

  afterEach(async () => await removeAllCollections())

  afterAll(async () => await mongoose.disconnect())
})

async function removeAllCollections() {
  const collections = Object.keys(mongoose.connection.collections)
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName]
    await collection.deleteMany()
  }
}