// this file is only available in the test environment
import { MongoMemoryServer } from 'mongodb-memory-server'

import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

jest.mock('../nats-wrapper')

let mongo: MongoMemoryServer

beforeAll(async () => {
  // set env vars
  process.env.JWT_KEY = 'asdf'

  // start copy of mongodb in memory for tests running
  mongo = await MongoMemoryServer.create()
  const mongoUri = mongo.getUri()

  await mongoose.connect(mongoUri, {})
})

beforeEach(async () => {
  jest.clearAllMocks()
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections()

    for (let collection of collections) {
      await collection.deleteMany({})
    }
  }
})

afterAll(async () => {
  if (mongo) {
    await mongo.stop()
  }
  await mongoose.connection.close()
})

declare global {
  var signin: () => string[]
}

global.signin = () => {
  // build a jwt payload {id, email}
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@asd.com',
  }

  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!)

  // Build session object { jwt: "token"}
  const session = JSON.stringify({ jwt: token })

  // Turn that session into JSON
  const base64 = Buffer.from(session).toString('base64')

  // Take JSON and encode it as base64
  return [`session=${base64}`]
}
