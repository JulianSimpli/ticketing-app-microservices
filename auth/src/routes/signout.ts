import express from 'express'

const router = express.Router()

router.post('/api/users/signout', (req, res) => {
  // empty user's cookie
  req.session = null
  res.send({})
})

export { router as signoutRouter }
