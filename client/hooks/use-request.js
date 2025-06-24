import { useState } from 'react'

import axios from 'axios'

export default ({ url, method, data, onSuccess }) => {
  const [errors, setErrors] = useState(null)

  const doRequest = async () => {
    setErrors(null)
    try {
      const response = await axios[method](url, data)

      if (onSuccess) {
        onSuccess(response.data)
      }

      return response.data
    } catch (error) {
      setErrors(
        <div className="alert alert-danger mt-3">
          <h4>Ooops...</h4>
          <ul>
            {error.response.data.errors.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      )
    }
  }

  return { doRequest, errors }
}
