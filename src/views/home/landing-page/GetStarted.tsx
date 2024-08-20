// Next Imports
import Link from 'next/link'

// MUI Imports
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import frontCommonStyles from '@views/home/styles.module.css'

const GetStarted = () => {
  return (
    <section className='relative'>
      <img
        src='/images/front-pages/landing-page/get-started-bg.png'
        alt='background-image'
        className='absolute is-full flex -z-1 pointer-events-none bs-full block-end-0'
      />
      <div
        className={classnames(
          'flex items-center flex-wrap justify-center lg:justify-between gap-y-4 gap-x-28',
          frontCommonStyles.layoutSpacing
        )}
      >
        <div className='flex flex-col items-start gap-y-8 gap-x-4 pbs-9 lg:plb-9 z-[1]'>
          <div className='flex flex-col gap-1'>
            <Typography color='primary' className='font-bold text-[32px]'>
              Ready to Get Started?
            </Typography>
            <Typography className='font-medium' color='text.secondary'>
              Start your project with AoWallet for free
            </Typography>
          </div>
          <Button
            component={Link}
            href='/home'
            variant='contained'
          >
            Get Started
          </Button>
        </div>
        <div className='flex pbs-4 lg:pbs-[60px] md:pie-4 z-[1]'>
          <img
            src='/images/front-pages/landing-page/crm-dashboard.png'
            alt='dashboard-image'
            className='max-is-[600px] is-full'
          />
        </div>
      </div>
    </section>
  )
}

export default GetStarted
