import mongoose from "mongoose"
import { Order, OrderStatus } from "./order"

interface TicketAttrs {
	title: string
	price: number
}

export interface TicketDoc extends mongoose.Document {
	title: string
	price: number
	// method that going to exist on individual ticket document
	isReserved(): Promise<boolean>
}

interface TicketModel extends mongoose.Model<TicketDoc> {
	build(attrs: TicketAttrs): TicketDoc
}

const ticketSchema = new mongoose.Schema<TicketDoc, TicketModel>({
	title: { type: String, required: true },
	price: { type: Number, required: true, min: 0 },
}, {
	toJSON: {
		transform(doc, ret) {
			ret.id = ret._id
			delete ret._id
		}
	}
})

// Add a static method to the model created by the schema
ticketSchema.statics.build = (attrs: TicketAttrs) => {
	return new Ticket(attrs)
}

// Add a new method to a document
ticketSchema.methods.isReserved = async function () {
	// this === the ticket document that we just called 'isReserved' on
	// make sure that the ticket is not already reserved
	// run query to look at all orders. Find an order where the ticket
	// is the ticket we just found and the order status is not cancelled.
	// if we find an order from that means the ticket is already reserved
	const existingOrder = await Order.findOne({
		ticket: this,
		status: {
			$in: [
				OrderStatus.Created,
				OrderStatus.AwaitingPayment,
				OrderStatus.Complete,
			]
		}
	})

	return !!existingOrder
}

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema)

export { Ticket }