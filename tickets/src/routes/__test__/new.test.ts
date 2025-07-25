import request from 'supertest'

import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import { natsClient } from '../../nats-wrapper'

const API_URL = '/api/tickets'

it('has a route handler listening to /api/tickets for post requests', async () => {
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

it('returns an error if an invalid title is provided', async () => {
  await request(app)
    .post(API_URL)
    .set('Cookie', global.signin())
    .send({ title: '', price: 10 })
    .expect(400)

  await request(app)
    .post(API_URL)
    .set('Cookie', global.signin())
    .send({ price: 10 })
    .expect(400)
})

it('returns an error if an invalid price is provided', async () => {
  await request(app)
    .post(API_URL)
    .set('Cookie', global.signin())
    .send({ title: 'asfdsf', price: -10 })
    .expect(400)

  await request(app)
    .post(API_URL)
    .set('Cookie', global.signin())
    .send({ title: 'asfdsf' })
    .expect(400)
})

it('creates a ticket with valid inputs', async () => {
  let tickets = await Ticket.find({})
  expect(tickets.length).toEqual(0)
  await request(app)
    .post(API_URL)
    .set('Cookie', global.signin())
    .send({ title: 'asfdsf', price: 10 })
    .expect(201)
  tickets = await Ticket.find({})
  expect(tickets.length).toEqual(1)
  expect(natsClient.client.jetstream).toHaveBeenCalled()
})
