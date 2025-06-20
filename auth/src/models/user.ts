import mongoose from 'mongoose'
import { PasswordManager } from '../services/password-manager'

interface UserAttrs {
  email: string
  password: string
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc
}

interface UserDoc extends mongoose.Document {
  email: string
  password: string
  // extra properties if we want like createdAt, updatedAt
}

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.password
        delete ret.__v
      },
    },
  }
)

// custom function built into a model
userSchema.statics.build = (data: UserAttrs) => {
  return new User(data)
}

// mongoose middleware
// we have to use 'this' so we cannot use an arrow function for the callback
// remember that in arrow functions, 'this' points to the context of the current file, the module, in this case
userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await PasswordManager.toHash(this.get('password'))
    this.set('password', hashed)
  }
  done()
})

const User = mongoose.model<UserDoc, UserModel>('User', userSchema)

export { User }
