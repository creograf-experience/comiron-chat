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
const chatService = require("src/service/chat");

const VALID_PHONE_NUMBER = { phone: "71234556789" };
const VALID_REQUEST = { phone: "+71234556789" };
const VALID_PHONE_EXISTED_USER = { phone: "77081068805" };

const CHATS_URL = '/api/users/chats';

let token = '';
// mongoose.set('debug', true)
describe('chats route', () => {
  describe('get all chats', () => {
    it('successfully get all chats', async () => {
      const response = await request(app)
        .get(CHATS_URL)
        .set('Authorization', token)

      const chats = JSON.parse(response.text)

      expect(response.status).toBe(200);
      expect(chats.length).toBeGreaterThan(0);
    })
  })

  beforeAll(async () =>
    await mongoose.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }, async (err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    })
  );

  beforeEach(async () => {
    await User.insertMany([VALID_PHONE_NUMBER, VALID_PHONE_EXISTED_USER]);
    const user = await User.findOne(VALID_PHONE_NUMBER);

    await chatService.createChat(
      { id: user._id, phone: user.phone },
      { phone: VALID_PHONE_EXISTED_USER.phone, contactName: VALID_PHONE_EXISTED_USER.phone })

    const verifyPhone = await request(app)
      .post('/api/users/auth/is-verified')
      .send(VALID_REQUEST);

    const json = JSON.parse(verifyPhone.text);
    token = json.jwtToken;
  })

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

/*
receiver
{
  "phone": "73512002015",
  "contactName": "+73512002015"
}
content
{
  "message": "some text",
  "attachment": null
}
sender
{
  "id": "5f2781e193fd15062f38f8c3",
  "phone": "77081057805"
}
 */