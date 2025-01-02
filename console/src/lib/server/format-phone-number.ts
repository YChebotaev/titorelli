import { parsePhoneNumberFromString } from 'libphonenumber-js'

export const formatPhoneNumber = (rawPhone: string) => {
  const parsedPhone = parsePhoneNumberFromString(rawPhone, 'RU')

  return parsedPhone?.formatInternational() ?? null
}
