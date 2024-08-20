// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Slider from '@mui/material/Slider'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'

// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import frontCommonStyles from '@views/home/styles.module.css'

// SVG Imports
import Lines from '@assets/svg/front-pages/landing-page/Lines'
import Curve from '@assets/svg/front-pages/landing-page/Curve'
import Arrow from '@assets/svg/front-pages/landing-page/Arrow'
import ElementTwo from '@/assets/svg/front-pages/landing-page/ElementTwo'

const pricingPlans = [
  {
    title: 'Basic Plan',
    price: 20,
    features: ['Timeline', 'Basic search', 'Live chat widget', 'Email marketing', 'Custom Forms', 'Traffic analytics'],
    supportType: 'Basic',
    supportMedium: 'Only Email',
    respondTime: 'AVG. Time: 24h',
    current: false
  },
  {
    title: 'Favourite Plan',
    price: 51,
    features: [
      'Everything in basic',
      'Timeline with database',
      'Advanced search',
      'Marketing automation',
      'Advanced chatbot',
      'Campaign management'
    ],
    supportType: 'Standard',
    supportMedium: 'Email & Chat',
    respondTime: 'AVG. Time: 6h',
    current: true
  },
  {
    title: 'Standard Plan',
    price: 99,
    features: [
      'Campaign management',
      'Timeline with database',
      'Fuzzy search',
      'A/B testing sanbox',
      'Custom permissions',
      'Social media automation'
    ],
    supportType: 'Exclusive',
    supportMedium: 'Email, Chat & Google Meet',
    respondTime: 'Live Support',
    current: false
  }
]

function PricingPlan() {
  // States
  const [val, setVal] = useState<number>(458)

  const handleChange = (_: Event, newValue: number | number[]) => {
    setVal(newValue as number)
  }

  return (
    <section
      id='pricing-plans'
      className={classnames('flex flex-col gap-12 lg:gap-12 plb-[100px]', frontCommonStyles.layoutSpacing)}
    >
      <div className='flex flex-col items-center justify-center'>
        <div className='flex is-full justify-center relative'>
          <ElementTwo className='absolute inline-start-0' />
          <div className='flex items-center justify-center mbe-6 gap-3 text-center'>
            <Lines />
            <Typography color='text.primary' className='font-medium uppercase'>
              Pricing Plans
            </Typography>
          </div>
        </div>
        <div className='flex items-center flex-wrap justify-center gap-x-2 mbe-1'>
          <Typography variant='h4' className='font-bold'>
            Tailored pricing plans
          </Typography>
          <Typography variant='h5'>designed for you</Typography>
        </div>
        <Typography color='text.secondary' className='font-medium text-center'>
          All plans include 40+ advanced tools and features to boost your product. Choose the best plan to fit your
          needs.
        </Typography>
      </div>
      <div className='text-center'>
        <Slider
          min={100}
          max={999}
          valueLabelDisplay='on'
          step={10}
          value={val}
          onChange={handleChange}
          className='is-[65%]'
        />
      </div>

      <Grid container spacing={6}>
        {pricingPlans.map((plan, index) => (
          <Grid item key={index} xs={12} lg={4}>
            <Card className={classnames('border shadow-none', ` ${plan.current && 'border-2 border-primary'}`)}>
              <CardContent className='flex flex-col gap-8 p-8'>
                <div className='is-full flex flex-col gap-3'>
                  <Typography className='text-center' variant='h4'>
                    {plan.title}
                  </Typography>
                  <div className='flex items-center gap-3'>
                    <div className='flex items-start'>
                      <Typography variant='h5' component='sup' className='text-lg font-medium'>
                        $
                      </Typography>
                      <Typography color='text.primary' className='font-bold text-5xl'>
                        {plan.price}
                      </Typography>
                    </div>
                    <div className='flex flex-col gap-1'>
                      <Typography color='text.primary' className='font-medium'>
                        Per month
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        10% off for yearly subscription
                      </Typography>
                    </div>
                  </div>
                  <Curve />
                </div>
                <div>
                  <div className='flex flex-col gap-3'>
                    {plan.features.map((feature, index) => (
                      <div key={index} className='flex items-center gap-[12px]'>
                        <Arrow />
                        <Typography variant='h5'>{feature}</Typography>
                      </div>
                    ))}
                  </div>
                  <Divider className='border mlb-4' />
                  <div className='flex gap-1 items-center justify-between'>
                    <div className='flex flex-col gap-0.25'>
                      <Typography color='text.primary' className='font-medium'>
                        {plan.supportType} Support
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        {plan.supportMedium}
                      </Typography>
                    </div>
                    <Chip variant='tonal' size='small' color='primary' label={plan.respondTime} />
                  </div>
                </div>
                <Button component={Link} href='/home/payment' variant={plan.current ? 'contained' : 'outlined'}>
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </section>
  )
}

export default PricingPlan
