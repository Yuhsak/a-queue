import {createAsyncQueue} from '../'

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

describe('createAsyncQueue', () => {

  describe('Generic', () => {

    test('resolve func', async () => {
      const queue = createAsyncQueue()
      const res = await queue.push(() => 'value')
      expect(res).toBe('value')
    })

    test('resolve async func', async () => {
      const queue = createAsyncQueue()
      const res = await queue.push(async () => 'value')
      expect(res).toBe('value')
    })

    test('resolve funcs sequencially', async () => {
      const queue = createAsyncQueue()
      const arr = []
      queue.push(() => wait(300).then(() => arr.push(0)))
      queue.push(() => arr.push(1))
      queue.push(() => wait(100).then(() => arr.push(2)))
      queue.push(async () => arr.push(3))
      await queue.push(() => Promise.resolve())
      expect(arr.join('')).toBe('0123')
    })

    test('catch error', async () => {

      const queue = createAsyncQueue()
      const arr = []
      const state: {reject?: (value?: unknown) => void} = {}
      const e = () => new Promise((resolve, reject) => {
        state.reject = reject
      })
      queue.push(e).catch(e => {
        arr.push(0)
      })
      queue.push(() => Promise.reject()).catch(e => {
        arr.push(1)
      })
      queue.push(() => {
        arr.push(2)
      })
      setTimeout(() => {
        state.reject?.()
      }, 100)
      await queue.push(() => Promise.resolve())
      expect(arr.join('')).toBe('012')
    })

  })

  test('Typed', async () => {
    const queue = createAsyncQueue('typed')
    const res = await queue.push((arg) => arg + ' case1')
    expect(res).toBe('typed case1')
    const res2 = await queue.push(async (arg) => arg + ' case2')
    expect(res2).toBe('typed case1 case2')
  })

})
