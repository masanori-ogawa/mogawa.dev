export async function triggerSiteDeploy(
  deployHookUrl: string | undefined,
): Promise<{ ok: true; message: string } | { ok: false; message: string }> {
  if (!deployHookUrl) {
    console.warn(
      JSON.stringify({
        level: 'warn',
        message: 'SITE_DEPLOY_HOOK_URL is not configured; skipping site rebuild',
      }),
    )
    return {
      ok: false,
      message: 'Deploy hook is not configured',
    }
  }

  try {
    const response = await fetch(deployHookUrl, { method: 'POST' })
    if (!response.ok) {
      const body = await response.text()
      console.error(
        JSON.stringify({
          level: 'error',
          message: 'Failed to trigger site deploy hook',
          status: response.status,
          body,
        }),
      )
      return {
        ok: false,
        message: `Deploy hook failed with status ${response.status}`,
      }
    }

    return {
      ok: true,
      message: 'Site rebuild triggered',
    }
  } catch (error) {
    console.error(
      JSON.stringify({
        level: 'error',
        message: 'Deploy hook request threw',
        error: error instanceof Error ? error.message : String(error),
      }),
    )
    return {
      ok: false,
      message: 'Deploy hook request failed',
    }
  }
}
