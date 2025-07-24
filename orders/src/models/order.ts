import mongoose from "mongoose"
import { OrderStatus } from "@js-ticketing-ms/common/enums"
import { TicketDoc } from "./ticket"

export { OrderStatus }

interface OrderAttrs {
  userId: string
  status: OrderStatus
  expiresAt: Date
  ticket: TicketDoc
}

interface OrderDoc extends mongoose.Document {
  userId: string
  status: OrderStatus
  expiresAt: Date
  ticket: TicketDoc
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc
}

// mongoose.Schema<Document, Model>
// <Document> represents the individual collection record -> each order
// ex. Order.findOne({ _id: '123' }) -> returns a OrderDoc and includes methods like .save()
// <Model> represents Order class not an instance of Order
// Model is the class that we use to interact with the collection
// Includes static methods like Order.build()

const orderSchema = new mongoose.Schema<OrderDoc, OrderModel>({
  userId: { type: String, required: true },
  status: { type: String, required: true, enum: Object.values(OrderStatus) },
  expiresAt: { type: mongoose.Schema.Types.Date },
  ticket: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }
}, {
  toJSON: {
    // ret -> plain js object
    // doc → Mongoose document → OrderDoc → that's why it has an _id
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id
    },
  },
})

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs)
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema)

export { Order }