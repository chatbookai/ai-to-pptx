import type { Settings } from '@core/contexts/settingsContext'

const demoConfigs: { [key: string]: Settings } = {
  'demo-1': {
    mode: 'light'
  },
  'demo-2': {
    mode: 'light',
    skin: 'bordered'
  },
  'demo-3': {
    mode: 'light',
    semiDark: true
  },
  'demo-4': {
    mode: 'dark'
  },
  'demo-5': {
    mode: 'light',
    layout: 'horizontal'
  },
  'demo-6': {
    layout: 'horizontal',
    skin: 'bordered',
    mode: 'dark'
  }
}

export default demoConfigs
