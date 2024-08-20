import 'server-only'

// Next Imports
import { cookies, headers } from 'next/headers'

// Type Imports
import type { Settings } from '@core/contexts/settingsContext'
import type { DemoName, SystemMode } from '@core/types'

// Config Imports
import themeConfig from '@configs/themeConfig'
import demoConfigs from '@configs/demoConfigs'

export const getDemoName = (): DemoName => {
  const headersList = headers()

  return headersList.get('X-server-header') as DemoName | null
}

export const getSettingsFromCookie = (): Settings => {
  const cookieStore = cookies()

  const demoName = getDemoName()

  const cookieName = demoName
    ? themeConfig.settingsCookieName.replace('demo-1', demoName)
    : themeConfig.settingsCookieName

  return JSON.parse(cookieStore.get(cookieName)?.value || '{}')
}

export const getMode = () => {
  const settingsCookie = getSettingsFromCookie()

  const demoName = getDemoName()

  // Get mode from cookie or fallback to theme config
  const _mode = settingsCookie.mode || (demoName && demoConfigs[demoName].mode) || themeConfig.mode

  return _mode
}

export const getSystemMode = (): SystemMode => {
  const cookieStore = cookies()
  const mode = getMode()

  const colorPrefCookie = (cookieStore.get('colorPref')?.value || 'light') as SystemMode

  return (mode === 'system' ? colorPrefCookie : mode) || 'light'
}

export const getServerMode = () => {
  const mode = getMode()
  const systemMode = getSystemMode()

  return mode === 'system' ? systemMode : mode
}

export const getSkin = () => {
  const settingsCookie = getSettingsFromCookie()

  return settingsCookie.skin || 'default'
}
