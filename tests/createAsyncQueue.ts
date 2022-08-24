import { createAsyncQueue } from '../'

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

describe('createAsyncQueue', () => {
  describe('push', () => {
    test('resolves func', async () => {
      const queue = createAsyncQueue()
      const res = await queue.push(() => 'value')
      expect(res).toBe('value')
    })

    test('resolves async func', async () => {
      const queue = createAsyncQueue()
      const res = await queue.push(async () => 'value')
      expect(res).toBe('value')
    })

    test('resolves funcs sequencially', async () => {
      const queue = createAsyncQueue()
      const arr: number[] = []
      queue.push(() => wait(300).then(() => arr.push(0)))
      queue.push(() => arr.push(1))
      queue.push(() => wait(100).then(() => arr.push(2)))
      queue.push(async () => arr.push(3))
      await queue.push(() => Promise.resolve())
      expect(arr).toStrictEqual([0, 1, 2, 3])
    })
  })

  describe('sequence', () => {
    test('transforms parallel to sequence', async () => {
      const arr: number[] = []
      const mapper = (ms: number) =>
        wait(ms * 100).then(() => {
          arr.push(ms)
          return ms
        })
      const ms: number[] = [5, 4, 3, 2, 1]

      const parallel = await Promise.all(ms.map(mapper))
      expect(parallel).toStrictEqual([5, 4, 3, 2, 1])
      expect(arr).toStrictEqual([1, 2, 3, 4, 5])
      arr.splice(0)

      const { sequence } = createAsyncQueue()
      const seq = await Promise.all(ms.map(sequence(mapper)))
      expect(seq).toStrictEqual([5, 4, 3, 2, 1])
      expect(arr).toStrictEqual([5, 4, 3, 2, 1])
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
