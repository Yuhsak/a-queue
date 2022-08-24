export declare type Resolved<T> = T extends Promise<infer U> ? U : T
export declare type PromiseOnce<T> = T extends Promise<infer U> ? Promise<U> : Promise<T>
export declare type PushFn = <T extends () => any>(fn: T) => PromiseOnce<ReturnType<T>>
export declare type TypedPushFn<T> = (fn: (arg: Resolved<T>) => Resolved<T> | PromiseOnce<T>) => PromiseOnce<T>
export declare type SequenceFn = <T extends any[], R>(fn: (...args: T) => R) => (...args: T) => PromiseOnce<R>
export declare type AsyncQueue = {
  push: PushFn
  sequence: SequenceFn
}
export declare type TypedAsyncQueue<T> = {
  push: TypedPushFn<T>
  sequence: SequenceFn
}
export declare function createAsyncQueue(): AsyncQueue
export declare function createAsyncQueue<T>(firstArg: T): TypedAsyncQueue<T>
