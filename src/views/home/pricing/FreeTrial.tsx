// Next Imports
import Link from 'next/link'

// MUI Imports
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'

// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import frontCommonStyles from '@views/home/styles.module.css'

const FreeTrial = () => {
  return (
    <section className='bg-primaryLight'>
      <div className={classnames('flex justify-between flex-wrap md:relative', frontCommonStyles.layoutSpacing)}>
        <Grid container spacing={2}>
          <Grid xs={12} md={6}>
            <div className='flex flex-col gap-11 md:mis-2 items-center md:items-start justify-center plb-10'>
              <div className='flex flex-col gap-2 mis-2 md:mis-0'>
                <Typography variant='h4' color='primary' className='font-medium'>
                  Still not convinced? Start with a 14-day FREE trial!
                </Typography>
                <Typography color='text.secondary'>
                  You will get full access to with all the features for 14 days.
                </Typography>
              </div>
              <Button component={Link} href='/home/payment' variant='contained'>
                Start 14-Days Free Trial
              </Button>
            </div>
          </Grid>
        </Grid>
      </div>
    </section>
  )
}

export default FreeTrial
