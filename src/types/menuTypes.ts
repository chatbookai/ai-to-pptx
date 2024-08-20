// React Imports
import type { ReactNode } from 'react'

// MUI Imports
import type { ChipProps } from '@mui/material/Chip'

// Type Imports
import type {
  SubMenuProps as VerticalSubMenuProps,
  MenuItemProps as VerticalMenuItemProps,
  MenuSectionProps as VerticalMenuSectionProps
} from '@menu/vertical-menu'
import type {
  SubMenuProps as HorizontalSubMenuProps,
  MenuItemProps as HorizontalMenuItemProps
} from '@menu/horizontal-menu'
import type { MenuItemExactMatchUrlProps } from '@menu/types'

// Vertical Menu Data
export type VerticalMenuItemDataType = Omit<
  VerticalMenuItemProps,
  'children' | 'exactMatch' | 'activeUrl' | 'icon' | 'prefix' | 'suffix'
> &
  MenuItemExactMatchUrlProps & {
    label: ReactNode
    excludeLang?: boolean
    icon?: string
    prefix?: ReactNode | ChipProps
    suffix?: ReactNode | ChipProps
  }
export type VerticalSubMenuDataType = Omit<VerticalSubMenuProps, 'children' | 'icon' | 'prefix' | 'suffix'> & {
  children: VerticalMenuDataType[]
  icon?: string
  prefix?: ReactNode | ChipProps
  suffix?: ReactNode | ChipProps
}
export type VerticalSectionDataType = Omit<VerticalMenuSectionProps, 'children'> & {
  isSection: boolean
  children: VerticalMenuDataType[]
}
export type VerticalMenuDataType = VerticalMenuItemDataType | VerticalSubMenuDataType | VerticalSectionDataType

// Horizontal Menu Data
export type HorizontalMenuItemDataType = Omit<
  HorizontalMenuItemProps,
  'children' | 'exactMatch' | 'activeUrl' | 'icon' | 'prefix' | 'suffix'
> &
  MenuItemExactMatchUrlProps & {
    label: ReactNode
    excludeLang?: boolean
    icon?: string
    prefix?: ReactNode | ChipProps
    suffix?: ReactNode | ChipProps
  }
export type HorizontalSubMenuDataType = Omit<HorizontalSubMenuProps, 'children' | 'icon' | 'prefix' | 'suffix'> & {
  children: HorizontalMenuDataType[]
  icon?: string
  prefix?: ReactNode | ChipProps
  suffix?: ReactNode | ChipProps
}
export type HorizontalMenuDataType = HorizontalMenuItemDataType | HorizontalSubMenuDataType
