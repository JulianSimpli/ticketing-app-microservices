import { useState } from 'react'
import { useRouter } from 'next/router'

import useRequest from './../../hooks/use-request.js'

export default () => {
  const [data, setData] = useState({
    email: '',
    password: '',
  })
  const router = useRouter()
  const { doRequest, errors } = useRequest({
    url: '/api/users/signin',
    method: 'post',
    data,
    onSuccess: () => router.push('/'),
  })

  const onChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    await doRequest()
  }

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign In</h1>
      <div>
        <label>Email Address</label>
        <input
          className="form-control"
          name="email"
          value={data.email}
          onChange={onChange}
        />
      </div>
      <div>
        <label>Password</label>
        <input
          className="form-control"
          type="password"
          name="password"
          value={data.password}
          onChange={onChange}
        />
      </div>
      {errors}
      <button className="btn btn-primary">Sign In</button>
    </form>
  )
}
