'use client'

// React Imports
import { useEffect } from 'react'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import HeroSection from './HeroSection'
import UsefulFeature from './UsefulFeature'
import ProductStat from './ProductStat'
import Faqs from './Faqs'
import { useSettings } from '@core/hooks/useSettings'

//import CustomerReviews from './CustomerReviews'
//import Pricing from './Pricing'
//import OurTeam from './OurTeam'
//import GetStarted from './GetStarted'
//import ContactUs from './ContactUs'

const LandingPageWrapper = ({ mode }: { mode: Mode }) => {
  // Hooks
  const { updatePageSettings } = useSettings()

  // For Page specific settings
  useEffect(() => {
    return updatePageSettings({
      skin: 'default'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <HeroSection mode={mode} />
      <UsefulFeature />
      <ProductStat />
      <Faqs />
    </>
  )
}

export default LandingPageWrapper
