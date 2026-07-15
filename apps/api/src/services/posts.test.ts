import { describe, expect, it, vi } from 'vitest'
import { triggerSiteDeploy } from '../services/deploy-site'
import { isUniqueConstraintError } from '../services/errors'

describe('triggerSiteDeploy', () => {
  it('returns failure when hook is missing', async () => {
    const result = await triggerSiteDeploy(undefined)
    expect(result.ok).toBe(false)
  })

  it('posts to deploy hook URL', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => 'ok',
    })
    vi.stubGlobal('fetch', fetchMock)

    const result = await triggerSiteDeploy('https://example.com/hook')
    expect(result.ok).toBe(true)
    expect(fetchMock).toHaveBeenCalledWith('https://example.com/hook', {
      method: 'POST',
    })

    vi.unstubAllGlobals()
  })
})

describe('isUniqueConstraintError', () => {
  it('detects unique constraint messages', () => {
    expect(isUniqueConstraintError(new Error('UNIQUE constraint failed'))).toBe(
      true,
    )
    expect(isUniqueConstraintError(new Error('other'))).toBe(false)
  })
})
