// React Imports
import { useMemo } from 'react'

// Third-party imports
import { useColorScheme } from '@mui/material'

// Type imports
import type { Mode } from '@core/types'

// Hook Imports
import { useSettings } from './useSettings'

export const useImageVariant = (
  mode: Mode,
  imgLight: string,
  imgDark: string,
  imgLightBordered?: string,
  imgDarkBordered?: string
): string => {
  // Hooks
  const { settings } = useSettings()
  const { mode: muiMode, systemMode: muiSystemMode } = useColorScheme()

  return useMemo(() => {
    const isServer = typeof window === 'undefined'

    const currentMode = (() => {
      if (isServer) return mode

      return muiMode === 'system' ? muiSystemMode : muiMode
    })()

    const isBordered = settings?.skin === 'bordered'
    const isDarkMode = currentMode === 'dark'

    if (isBordered && imgLightBordered && imgDarkBordered) {
      return isDarkMode ? imgDarkBordered : imgLightBordered
    }

    return isDarkMode ? imgDark : imgLight
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, muiMode, muiSystemMode])
}
