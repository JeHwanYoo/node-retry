import { describe, expect, it } from 'vitest'
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
})
