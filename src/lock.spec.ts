import { describe, expect, it, vi } from 'vitest'
import { retry } from './optimistic.lock.retry.js'

it('ok', () => {
  expect(true).toBeTruthy()
})

describe('retry function', () => {
  it('should succeed with a non-promise type', () => {
    const return10 = retry(10, 100)(() => 10)(console.error)
    expect(return10()).toBe(10)
  })

  it('should succeed with a promise type', async () => {
    const returnAwait10 = retry(10, 100)(async () => 10)(console.error)
    expect(await returnAwait10())
  })

  it('should retry 5 times and succeed', async () => {
    let attempt = 0

    const spy = vi.fn().mockImplementation(async () => {
      if (attempt < 5) {
        attempt++
        throw new Error()
      }
      return 10
    })

    const return10 = retry(10, 100)(spy)(console.error)
    expect(await return10()).toBe(10)
    expect(spy).toHaveBeenCalledTimes(6) // retry 5 and succeed(+1)
  })

  it('should retry 10 and fail', async () => {
    const spy = vi.fn().mockImplementation(async () => {
      throw new Error()
    })

    await expect(retry(10, 100)(spy)(e => e)()).resolves.toBeInstanceOf(Error)
    expect(spy).toHaveBeenCalledTimes(10)
  })
})
