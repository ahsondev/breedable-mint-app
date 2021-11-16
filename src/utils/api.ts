import axios from 'axios'
import config from './config'

const instance = axios.create({
  baseURL: config.apiUrl,
  params: {},
  headers: {
    common: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  },
})

export default instance
