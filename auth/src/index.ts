import mongoose from 'mongoose'

import { app } from './app'

// remove wrapper function for "type": "module" config
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined')
  }

  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth')
    console.log('Connected to MongoDB')

    app.listen(3000, () => {
      console.log('Listening Auth server on port 3000')
    })
  } catch (error) {
    console.error('Failed to start server: ', error)
    process.exit(1)
  }
}

start()
