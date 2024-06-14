import { Retry } from './optimistic.lock.retry.type.js'

/**
 *
 * @param maxAttempt 최대 시도 회수
 * @param delay 재시도 시 딜레이
 */
export const retry: Retry =
  (maxAttempt, delay) =>
  /**
   *
   * @param fn 실행할 함수
   */
  fn =>
  /**
   *
   * @param backoff 실패시 실행할 함수
   */
  backoff =>
  (...args) => {
    const attemptFn = (attempt: number) => {
      try {
        const result = fn(...args)
        if (result instanceof Promise) {
          return result.catch(e => handleError(e, attempt))
        }
        return result
      } catch (e) {
        return handleError(e, attempt)
      }
    }

    const handleError = (e: unknown, attempt: number) => {
      if (attempt === maxAttempt) {
        return backoff(e)
      }
      return new Promise(resolve =>
        setTimeout(() => resolve(attemptFn(attempt + 1)), delay),
      )
    }

    return attemptFn(1)
  }
