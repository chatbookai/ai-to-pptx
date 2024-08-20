// React Imports
import { useEffect, useRef } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

// Third-party Imports
import classnames from 'classnames'

// Hook Imports
import { useIntersection } from '@/hooks/useIntersection'

// SVG Imports
import Lines from '@assets/svg/front-pages/landing-page/Lines'
import LaptopCharging from '@assets/svg/front-pages/landing-page/LaptopCharging'
import TransitionUp from '@assets/svg/front-pages/landing-page/TransitionUp'
import Edit from '@assets/svg/front-pages/landing-page/Edit'
import Cube from '@assets/svg/front-pages/landing-page/Cube'
import LifeBuoy from '@assets/svg/front-pages/landing-page/Lifebuoy'
import Document from '@assets/svg/front-pages/landing-page/Document'

// Styles Imports
import styles from './styles.module.css'
import frontCommonStyles from '@views/home/styles.module.css'

// Data
const feature = [
  {
    icon: <LaptopCharging />,
    title: 'Wallet',
    description: 'Create and manage AO & AR wallets, support data encryption, and code auditing.'
  },
  {
    icon: <TransitionUp />,
    title: 'Token',
    description: 'Search for tokens, add tokens, check balance, view transaction history, holders, and support online create token.'
  },
  {
    icon: <Document />,
    title: 'Faucet',
    description: 'Support obtaining aggregated Tokens through an online faucet.'
  },
  {
    icon: <Edit />,
    title: 'Email',
    description: 'An AO-based Email system that supports folder and data encryption, and using AR addresses as recipients.'
  },
  {
    icon: <LifeBuoy />,
    title: 'Chat',
    description: 'An AO-based Chat system that supports different Channels and allows for setting respective administrators.'
  },
  {
    icon: <Cube />,
    title: 'Apps',
    description: 'Integrate third-party application subsystems based on AO, allowing users to vote on which applications can be added to Apps.'
  }
]

const UsefulFeature = () => {
  // Refs
  const skipIntersection = useRef(true)
  const ref = useRef<null | HTMLDivElement>(null)

  // Hooks
  const { updateIntersections } = useIntersection()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (skipIntersection.current) {
          skipIntersection.current = false

          return
        }

        updateIntersections({ [entry.target.id]: entry.isIntersecting })
      },
      { threshold: 0.35 }
    )

    ref.current && observer.observe(ref.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section id='features' ref={ref} className='bg-backgroundPaper'>
      <div className={classnames('flex flex-col gap-12 plb-[60px]', frontCommonStyles.layoutSpacing)}>
        <div className='flex flex-col items-center justify-center'>
          <div className='flex items-center justify-center mbe-6 gap-3'>
            <Lines />
            <Typography color='text.primary' className='font-medium uppercase'>
              Useful Feature
            </Typography>
          </div>
          <div className='flex items-center justify-center flex-wrap gap-2 mbe-2 sm:mbe-1'>
            <Typography variant='h4' className='font-bold'>
              Everything you need
            </Typography>
            <Typography variant='h5'>to start your web3 project</Typography>
          </div>
          <Typography className='font-medium text-center'>
            Not just a set of tools, the package includes ready-to-deploy conceptual application.
          </Typography>
        </div>
        <div>
          <Grid container columnSpacing={6} rowSpacing={12}>
            {feature.map((item, index) => (
              <Grid item xs={12} sm={6} lg={4} key={index}>
                <div className='flex flex-col gap-2 justify-center items-center'>
                  <div className={classnames('mbe-2', styles.featureIcon)}>
                    <div className='flex items-center border-2 rounded-full p-5 is-[82px] bs-[82px]'>{item.icon}</div>
                  </div>
                  <Typography variant='h5'>{item.title}</Typography>
                  <Typography className='max-is-[364px] text-center'>{item.description}</Typography>
                </div>
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
    </section>
  )
}

export default UsefulFeature
