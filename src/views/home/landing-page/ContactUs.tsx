// React Imports
import { useEffect, useRef } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

// Third-party Imports
import classnames from 'classnames'

// Hook Imports
import { useIntersection } from '@/hooks/useIntersection'

// SVG Imports
import ElementTwo from '@assets/svg/front-pages/landing-page/ElementTwo'
import Lines from '@assets/svg/front-pages/landing-page/Lines'

// Styles Imports
import frontCommonStyles from '@views/home/styles.module.css'

const ContactUs = () => {
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
    <section
      id='contact-us'
      className={classnames('flex flex-col gap-14 plb-[100px]', frontCommonStyles.layoutSpacing)}
      ref={ref}
    >
      <div className='flex flex-col items-center justify-center'>
        <div className='flex is-full justify-center items-center relative'>
          <ElementTwo className='absolute inline-start-0' />
          <div className='flex items-center justify-center mbe-6 gap-3'>
            <Lines />
            <Typography color='text.primary' className='font-medium uppercase'>
              Contact Us
            </Typography>
          </div>
        </div>
        <div className='flex items-center flex-wrap justify-center gap-x-2 mbe-1'>
          <Typography variant='h4' className='font-bold'>
            Lets work
          </Typography>
          <Typography variant='h5'>together</Typography>
        </div>
        <Typography color='text.secondary' className='font-medium text-center'>
          Any question or remark? just write us a message
        </Typography>
      </div>
      <div>
        <Grid container spacing={6}>
          <Grid item xs={12} md={6} lg={5}>
            <Card className='bg-primary'>
              <CardContent className='flex flex-col gap-5 pli-8 pbs-8 pbe-7'>
                <div className='flex flex-col gap-[6px]'>
                  <Typography className='font-medium text-white'>Let’s contact with us</Typography>
                  <Typography variant='h4' className='text-white'>
                    Share your ideas or requirement with our experts.
                  </Typography>
                </div>
                <img src='/images/front-pages/landing-page/chat.png' alt='chat' className='is-full' />
                <Typography className='text-white'>
                  Looking for more customisation, more features, and more anything? Don’t worry, We’ve provide you with
                  an entire team of experienced professionals.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={7}>
            <Card>
              <CardContent>
                <Typography variant='h5' className='mbe-5'>
                  Share your ideas
                </Typography>
                <form className='flex flex-col items-start gap-5'>
                  <div className='flex gap-5 is-full'>
                    <TextField fullWidth label='Full name' id='name-input' />
                    <TextField fullWidth label='Email address' id='email-input' type='email' />
                  </div>
                  <TextField fullWidth multiline rows={6} label='Message' id='message-input' />
                  <Button variant='contained' disabled>Send Inquiry</Button>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </section>
  )
}

export default ContactUs
