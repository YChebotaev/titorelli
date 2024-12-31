import { decode } from 'decode-formdata'

export function formDataToObject<T extends Record<string, unknown>>(fd: FormData) {
  if (fd.has('_d'))
    return JSON.parse(fd.get('_d')?.toString() ?? 'null') as T

  return decode(fd) as T
}

export function objectToFormData(obj: Record<string, unknown>) {
  const fd = new FormData()

  fd.set('_d', JSON.stringify(obj))

  return fd
}
