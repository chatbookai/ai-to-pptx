// React Imports
import { useContext } from 'react'

// Context Imports
import { IntersectionContext } from '@/contexts/intersectionContext'

export const useIntersection = () => {
  // Hooks
  const context = useContext(IntersectionContext)

  if (!context) {
    throw new Error('useIntersection must be used within a IntersectionProvider')
  }

  return context
}
