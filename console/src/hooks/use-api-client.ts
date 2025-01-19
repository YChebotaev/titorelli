import axios from 'axios'
import { env } from '@/lib/server/env'

const client = axios.create({ baseURL: env.SITE_ORIGIN ?? '/' })

export const useApiClient = () => {
  return client
}
