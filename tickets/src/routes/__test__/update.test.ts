import request from 'supertest'
import mongoose from 'mongoose'

import { app } from '../../app'

const API_URL = '/api/tickets/'

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()

  const res = await request(app)
    .put(`${API_URL}${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'title',
      price: 15,
    })
    .expect(404)
})

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()

  await request(app)
    .put(`${API_URL}${id}`)
    .send({
      title: 'title',
      price: 15,
    })
    .expect(401)
})

it('returns a 401 if the user does not own the ticket', async () => {
  const res = await request(app)
    .post(API_URL)
    .set('Cookie', global.signin())
    .send({ title: 'title', price: 12 })

  await request(app)
    .put(`${API_URL}${res.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'asdasd',
      price: 123123,
    })
    .expect(401)
})

it('returns a 400 if the user provides an invalid title or price', async () => {
  const cookie = global.signin()

  const res = await request(app)
    .post(API_URL)
    .set('Cookie', cookie)
    .send({ title: 'title', price: 12 })

  await request(app)
    .put(`${API_URL}${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 15,
    })
    .expect(400)

  await request(app)
    .put(`${API_URL}${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'valid',
      price: -10,
    })
    .expect(400)
})

it('update the ticket provided valid inputs', async () => {
  const cookie = global.signin()

  const res = await request(app)
    .post(API_URL)
    .set('Cookie', cookie)
    .send({ title: 'title', price: 12 })

  const ticketUpdatedResponse = await request(app)
    .put(`${API_URL}${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'title updated',
      price: 15,
    })
    .expect(200)

  expect(ticketUpdatedResponse.body.title).toEqual('title updated')
  expect(ticketUpdatedResponse.body.price).toEqual(15)
})
