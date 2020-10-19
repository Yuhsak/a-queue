# pico-queue

One liner minimal (only 159 bytes) asynchronous function queue for node.js, browser and TypeScript

## Install

```sh
npm install pico-queue
```

## Usage

### Execute functions sequencially

The callback function passed into `queue.push()` will always be executed sequencially, which means that the next callback function will wait until completion of former callback if any promise is returned.

```ts
import {createAsyncQueue} from 'pico-queue'

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const queue = createAsyncQueue()

// wait 300ms, then log '1', '2', and wait 200ms, then log '3', '4'
queue.push(() => wait(300).then(() => {
  console.log('1')
}))

queue.push(() => {
  console.log('2')
})

queue.push(async () => {
  await wait(200)
  console.log('3')
})

queue.push(() => {
  console.log('4')
})
```

### Handle promise completion

`queue.push()` itself also returns a Promise to handle the completion of its callback function.

The returned Promise will be resolved right after the completion of the Promise which is returned from callback function.

```ts
import {createAsyncQueue} from 'pico-queue'

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const queue = createAsyncQueue()

// log 'start', then wait 500(300+200)ms, then log 'end'
const start = async () => {

  console.log('start')

  queue.push(() => wait(300))
  await queue.push(() => wait(200))

  console.log('end')

}

start()
```

### Chaining

If callback function returns a value, it will be the resolved value of the Promise returned from `queue.push()` itself and also will be passed to the next callback function.

Optionally, `createAsyncQueue()` accepts the value to pass to the very first callback function as its argument.

```ts
import {createAsyncQueue} from 'pico-queue'

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const queue = createAsyncQueue('1st')

// log '1st', log '1st2nd', and log '1st2nd3rd'
const start = async () => {

  // res1 = '1st2nd'
  const res1 = await queue.push(async arg => {
    await wait(300)
    console.log(arg) // '1st'
    return arg + '2nd'
  })

  // res2 = '1st2nd3rd'
  const res2 = await queue.push(async arg => {
    await wait(200)
    console.log(arg) // '1st2nd'
    return arg + '3rd'
  })

  console.log(res2)

}

start()
```

### Error handling

It is important to handle possible rejections properly at the time the callback function is pushing to the queue because `queue.push()` will implicitly handle rejections by adding `.catch` block to prevent all of following callback functions from being rejected.

This means that **any `UnhandledPromiseRejection` will never be thrown even if the Promise returned from callback rejected without any handling.**

To handle rejections on-the-fly, simply add `.catch` block for the Promise from `queue.push()` or use `try await ~ catch` clause.

```ts
import {createAsyncQueue} from 'pico-queue'

const queue = createAsyncQueue()

const start = async () => {

  // error handling with .catch
  queue.push(() => Promise.reject('with .catch')).catch((e) => {
    console.log(e)
  })

  // queue works properly even if former task was rejected
  queue.push(() => {
    console.log('it works')
  })

  // with try ~ catch clause
  try {
    await queue.push(() => Promise.reject('with try~catch'))
  } catch (e) {
    console.log(e)
  }

}

start()
```

### Typing

For safely typed chaining, type of the argument and return value can be specified optionally.

```ts
import {createAsyncQueue} from 'pico-queue'

// queue.push() accepts any type of function
const queue = createAsyncQueue()

queue.push(() => true)
queue.push(async () => true)

// typed.push() only accepts function typed as (value: string) => string
// then very first argument value must be specified
const typed = createAsyncQueue<string>('1st')

typed.push(arg => arg + '2nd')
typed.push(async arg => arg + '3rd')
