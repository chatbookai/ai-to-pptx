// React Imports
import { useEffect, useRef } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Grid from '@mui/material/Grid'

// Third-party Imports
import classnames from 'classnames'

// Hook Imports
import { useIntersection } from '@/hooks/useIntersection'

// SVG Imports
import ElementOne from '@/assets/svg/front-pages/landing-page/ElementOne'
import Lines from '@assets/svg/front-pages/landing-page/Lines'

// Styles Imports
import frontCommonStyles from '@views/home/styles.module.css'

type FaqsDataTypes = {
  id: string
  question: string
  active?: boolean
  answer: string
}

const FaqsData: FaqsDataTypes[] = [
  {
    id: 'panel1',
    question: 'Which platforms does AoWallet support?',
    answer:
      'Ios, Android, Chrome Extension, Web. There will be support for more browser extensions in the future.'
  },
  {
    id: 'panel2',
    question: 'What is AoWallet?',
    active: true,
    answer: `AoWallet is a wallet application on the AO and AR blockchains that supports data encryption and code auditing.

Supply AO & AR wallet function, Token, Faucet, Email, Chat, Blog.`
  },
  {
    id: 'panel3',
    question: 'What are the subsequent development plans for AoWallet?',
    answer:
      'The expected development features include: Blog, Paid documents, Swap. If you have better ideas or suggestions, feel free to contact us at any time.'
  }
]

const Faqs = () => {
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
      id='faq'
      ref={ref}
      className={classnames('flex flex-col gap-16 plb-[60px]', frontCommonStyles.layoutSpacing)}
    >
      <div className='flex flex-col items-center justify-center'>
        <div className='flex is-full justify-center items-center relative'>
          <ElementOne className='absolute inline-end-0' />
          <div className='flex items-center justify-center mbe-6 gap-3'>
            <Lines />
            <Typography color='text.primary' className='font-medium uppercase'>
              Faq
            </Typography>
          </div>
        </div>
        <div className='flex items-center flex-wrap justify-center gap-x-2 mbe-1'>
          <Typography variant='h5'>Frequently asked</Typography>
          <Typography variant='h4' className='font-bold'>
            questions
          </Typography>
        </div>
        <Typography color='text.secondary' className='font-medium text-center'>
          Browse through these FAQs to find answers to commonly asked questions.
        </Typography>
      </div>
      <div>
        <Grid container>
          <Grid item xs={12} lg={5} className='text-center'>
            <img
              src='/images/front-pages/landing-page/sitting-girl-with-laptop.png'
              alt='girl with laptop'
              className='is-[80%] max-is-[320px]'
            />
          </Grid>
          <Grid item xs={12} lg={7}>
            <div>
              {FaqsData.map((data, index) => {
                return (
                  <Accordion key={index} defaultExpanded={data.active}>
                    <AccordionSummary aria-controls={data.id + '-content'} id={data.id + '-header'}>
                      {data.question}
                    </AccordionSummary>
                    <AccordionDetails sx={{whiteSpace: 'pre-wrap'}}>{data.answer}</AccordionDetails>
                  </Accordion>
                )
              })}
            </div>
          </Grid>
        </Grid>
      </div>
    </section>
  )
}

export default Faqs
