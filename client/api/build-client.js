import axios from 'axios'

const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    // Server-side: requests should include baseURL and headers from the incoming request
    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req?.headers,
    })
  } else {
    // Browser-side: requests can use relative paths
    return axios.create({
      baseURL: '/',
    })
  }
}

export default buildClient
