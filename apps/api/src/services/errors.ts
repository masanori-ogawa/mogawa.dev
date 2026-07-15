export function isUniqueConstraintError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false
  }
  const message =
    'message' in error && typeof error.message === 'string'
      ? error.message
      : String(error)
  return (
    message.includes('UNIQUE') ||
    message.includes('unique') ||
    message.includes('SQLITE_CONSTRAINT')
  )
}
