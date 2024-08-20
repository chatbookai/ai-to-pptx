// React Imports
import type { ReactNode } from 'react'

export type Layout = 'vertical' | 'collapsed' | 'horizontal'

export type Skin = 'default' | 'bordered'

export type Mode = 'system' | 'light' | 'dark'

export type SystemMode = 'light' | 'dark'

export type Direction = 'ltr' | 'rtl'

export type LayoutComponentWidth = 'compact' | 'wide'

export type LayoutComponentPosition = 'fixed' | 'static'

export type ChildrenType = {
  children: ReactNode
}

export type DemoName = 'demo-1' | 'demo-2' | 'demo-3' | 'demo-4' | 'demo-5' | 'demo-6' | null

export type ThemeColor = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'
