import { Keymask } from 'keymask'

const keymaskNumber = new Keymask({
  seed: new Uint8Array([13, 18]).buffer,
  type: 'number'
})

export const maskNumber = (value: number) => {
  return keymaskNumber.mask(value)
}

export const unmaskNumber = (value: string | undefined | null) => {
  if (value == null)
    return null

  return keymaskNumber.unmask(value)
}
