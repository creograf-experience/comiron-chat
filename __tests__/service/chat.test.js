const mongoose = require('mongoose');
const {
  describe,
  expect,
  it,
  afterEach,
  beforeAll,
  afterAll
} = require("@jest/globals");

const User = require("src/model/user");
const chatService = require("src/service/chat");

const VALID_PHONE_NUMBER = { phone: "71234556789", };
const VALID_PHONE_EXISTED_USER = { phone: "77081068805" };
const RECEIVER = { phone: VALID_PHONE_EXISTED_USER.phone, contactName: VALID_PHONE_EXISTED_USER.phone }


// mongoose.set('debug', true)
describe('chat service', () => {
  describe('create chat', () => {
    it('successfully create chat', async () => {
      const user = await User.findOne(VALID_PHONE_NUMBER);

      const chat = await chatService.createChat({ id: user._id, phone: user.phone }, RECEIVER)

      expect(chat.users.length).toBe(2)
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
