import request from 'supertest'
import mongoose from 'mongoose'

import { app } from '../../app'

const API_URL = '/api/tickets'

const createTicket = async () => {
  await request(app)
    .post(API_URL)
    .set('Cookie', global.signin())
    .send({ title: 'asfdsf', price: 10 })
    .expect(201)
}

it('returns a 404 if the ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()

  await request(app).get(`${API_URL}/${id}`).expect(404)
})

it('returns the ticket if the ticket is found', async () => {
  const title = 'title'
  const price = 12

  const response = await request(app)
    .post(API_URL)
    .set('Cookie', global.signin())
    .send({ title, price })
    .expect(201)

  const newTicketId = response.body.id
  const getTicketResponse = await request(app)
    .get(`${API_URL}/${newTicketId}`)
    .expect(200)

  expect(getTicketResponse.body.id).toEqual(newTicketId)
})

it('returns all tickets', async () => {
  await createTicket()
  await createTicket()
  await createTicket()

  const response = await request(app).get(API_URL).expect(200)

  const tickets = response.body

  expect(tickets.length).toEqual(3)
})
