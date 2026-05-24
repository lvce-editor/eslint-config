const value = Reflect.get({ answer: 42 }, 'answer')
Reflect.deleteProperty({ answer: 42 }, 'answer')
const proxy = new Proxy({ answer: 42 }, {})

export const result = [value, proxy]