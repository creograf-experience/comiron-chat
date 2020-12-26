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
const Contact = require("src/model/contact");
const app = require("src/app");

const ADD_CONTACTS_URL = '/api/users/contacts';

const VALID_PHONE_NUMBER = { phone: "71234556789", };
const VALID_REQUEST = { phone: "+71234556789", };
const VALID_PHONE_EXISTED_USER = { phone: "77081068805" };

let token = '';

describe('contacts route', () => {
  describe('adding contacts', () => {
    it('successfully added contacts', async () => {
      const response = await request(app)
        .post(ADD_CONTACTS_URL)
        .set('Authorization', token)
        .send({ contacts: remoteContacts })

      const user = await User.findOne(VALID_PHONE_NUMBER);
      const userContacts = await Contact.find({ user: user._id })

      expect(response.status).toBe(200);
      expect(userContacts.length).toBe(4);
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

const remoteContacts = [
  {
    "phoneNumbers": [
      {
        "label": "mobile",
        "type": "2",
        "id": "1",
        "isPrimary": 0,
        "number": "+7 708 106 8805"
      },
      {
        "label": "mobile",
        "type": "2",
        "id": "237",
        "isPrimary": 0,
        "number": "+7 777 037 4878"
      }
    ],
    "lookupKey": "1654r1-269CE67854AC.2792r9-269CE67854AC",
    "firstName": "TEST",
    "contactType": "person",
    "name": "TEST_NAME",
    "id": "1",
    "imageAvailable": false
  },
  {
    "phoneNumbers": [
      {
        "label": "mobile",
        "type": "2",
        "id": "7",
        "isPrimary": 0,
        "number": "+77081067804"
      }
    ],
    "lookupKey": "3789r2-260678A28A78",
    "firstName": "TEST_1",
    "contactType": "person",
    "name": "TEST_NAME_1",
    "id": "75",
    "imageAvailable": false
  },
  {
    "phoneNumbers": [
      {
        "label": "mobile",
        "type": "2",
        "id": "8",
        "isPrimary": 0,
        "number": "+7 707 733 1533"
      },
      {
        "label": "mobile",
        "type": "2",
        "id": "15",
        "isPrimary": 0,
        "number": "+77077331533"
      }
    ],
    "lookupKey": "1654r3-261A8AC8AC9606A22862280316.3789r4-261A8AC8AC9606A22862280316",
    "firstName": "TEST_2",
    "contactType": "person",
    "name": "TEST_NAME_2",
    "id": "3",
    "imageAvailable": false,
    "lastName": "Теле2",
    "urlAddresses": [
      {
        "label": "other",
        "type": "7",
        "url": "http://like.beeline.kz",
        "id": "157",
        "isPrimary": 0
      }
    ]
  },
  {
    "phoneNumbers": [
      {
        "label": "mobile",
        "type": "2",
        "id": "16",
        "isPrimary": 0,
        "number": "+7 778 933 1724"
      },
      {
        "label": "mobile",
        "type": "2",
        "id": "22",
        "isPrimary": 0,
        "number": "+77789330724"
      }
    ],
    "lookupKey": "1654r5-260E660E0640062A4A067C72400672.3789r6-260E660E0640062A4A067C72400672.2792r23-260E660E0640062A4A067C72400672",
    "firstName": "TEST_3",
    "contactType": "person",
    "name": "TEST_NAME_3",
    "id": "5",
    "imageAvailable": false,
    "lastName": "TEST_LAST_NAME_3"
  },
]