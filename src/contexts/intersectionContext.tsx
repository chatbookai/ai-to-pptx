'use client'

// React Imports
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'

export const initialIntersections: Record<string, boolean> = {
  features: false,
  team: false,
  faq: false,
  'contact-us': false
}

type IntersectionContextProps = {
  intersections: Record<string, boolean>
  updateIntersections: (data: Record<string, boolean>) => void
}

export const IntersectionContext = createContext<IntersectionContextProps | null>(null)

export const IntersectionProvider = ({ children }: { children: ReactNode }) => {
  // States
  const [intersections, setIntersections] = useState(initialIntersections)

  const updateIntersections = (data: Record<string, boolean>) => {
    setIntersections(prev => {
      const isAnyActive = Object.values(intersections).some(value => value === true)

      if (!Object.values(data)[0] && !isAnyActive) return prev

      Object.keys(prev).forEach(key => {
        if (prev[key] === true && Object.keys(data).some(dataKey => data[dataKey] === true)) {
          prev[key] = false
        }
      })

      return { ...prev, ...data }
    })
  }

  return (
    <IntersectionContext.Provider value={{ intersections, updateIntersections }}>
      {children}
    </IntersectionContext.Provider>
  )
}
