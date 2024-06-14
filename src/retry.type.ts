type MaybePromise<T> = T | Promise<T>

export type Retry = (
  maxAttempt: number,
  delay: number,
) => <Fn extends (...args: any[]) => any>(
  fn: Fn,
) => <Backoff extends (e: unknown) => any>(
  backoff: Backoff,
) => (
  ...args: Parameters<Fn>
) => MaybePromise<ReturnType<Fn> | ReturnType<Backoff>>
