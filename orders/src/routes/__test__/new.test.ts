import request from 'supertest'

import { app } from '../../app'
import { natsClient } from '../../nats-wrapper'
import { Ticket } from '../../models/ticket'
import mongoose from 'mongoose'
import { Order, OrderStatus } from '../../models/order'

const API_URL = '/api/orders'

it('has a route handler listening to /api/orders for post requests', async () => {
  const response = await request(app).post(API_URL).send({})
  expect(response.status).not.toEqual(404)
  // or
  // await request(app).post(API_URL).send({}).expect(200)
})

it('can only be accessed if the user is signed in', async () => {
  await request(app).post(API_URL).send({}).expect(401)
})

it('returns status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post(API_URL)
    .set('Cookie', global.signin())
    .send({})
  expect(response.status).not.toEqual(401)
})

it('returns an error if an invalid ticketId is provided', async () => {
  await request(app)
    .post(API_URL)
    .set('Cookie', global.signin())
    .send({ ticketId: '123' })
    .expect(400)
})

it('returns an error if the ticket does not exist', async () => {
  const ticketId = new mongoose.Types.ObjectId()

  await request(app)
    .post(API_URL)
    .set('Cookie', global.signin())
    .send({ ticketId: ticketId })
    .expect(404)
})

it('returns an error if the ticket is already reserved', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  })
  await ticket.save()

  const order = Order.build({
    ticket: ticket,
    userId: 'asdf',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  })
  await order.save()

  await request(app)
    .post(API_URL)
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(400)
})

it('reserves a ticket', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  })
  await ticket.save()

  await request(app)
    .post(API_URL)
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201)
})

it.todo('emits an order created event')