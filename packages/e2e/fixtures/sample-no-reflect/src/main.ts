export const obj = {
  method: (): void => {},
}

const result = Reflect.get(obj, 'method')
