import axios from 'axios'

export const createClient = (serviceUrl: string) => {
  return axios.create({
    baseURL: serviceUrl
  })
}
