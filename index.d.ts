export declare type Resolved<T> = T extends Promise<infer U> ? U : T
export declare type PromiseOnce<T> = Promise<Resolved<T>>
export declare type PushFn = <T extends () => any>(fn: T) => PromiseOnce<ReturnType<T>>
export declare type TypedPushFn<T> = (fn: (arg: Resolved<T>) => Resolved<T> | PromiseOnce<T>) => PromiseOnce<T>
export declare type AsyncQueue = {
  push: PushFn
}
export declare type TypedAsyncQueue<T> = {
  push: TypedPushFn<T>
}
export declare function createAsyncQueue(): AsyncQueue
export declare function createAsyncQueue<T>(firstArg: T): TypedAsyncQueue<T>
