// React Imports
import { useState } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Badge from '@mui/material/Badge'
import Rating from '@mui/material/Rating'

// Third-party Imports
import type { TrackDetails } from 'keen-slider/react'
import { useKeenSlider } from 'keen-slider/react'
import classnames from 'classnames'

// Styled Component Imports
import AppKeenSlider from '@/libs/styles/AppKeenSlider'

// SVG Imports
import Lines from '@assets/svg/front-pages/landing-page/Lines'
import Levis from '@assets/svg/front-pages/landing-page/Levis'
import Continental from '@assets/svg/front-pages/landing-page/Continental'
import Eckerd from '@assets/svg/front-pages/landing-page/Eckerd'
import Dribbble from '@assets/svg/front-pages/landing-page/Dribbble'
import Airbnb from '@assets/svg/front-pages/landing-page/Airbnb'

// Styles Imports
import frontCommonStyles from '@views/home/styles.module.css'

// Data
const data = [
  {
    desc: "I've never used a theme as versatile and flexible as Vuexy. It's my go to for building dashboard sites on almost any project.",
    svg: <Eckerd color='#2882C3' />,
    rating: 5,
    name: 'Eugenia Moore',
    position: 'Founder of Hubspot'
  },
  {
    desc: 'Materio is awesome, and I particularly enjoy knowing that if I get stuck on something.',
    svg: <Levis color='#A8112E' />,
    rating: 5,
    name: 'Tommy haffman',
    position: 'Founder of Levis'
  },
  {
    desc: "This template is superior in so many ways. The code, the design, the regular updates, the support.. It's the whole package. Excellent Work.",
    svg: <Airbnb color='#FF5A60' />,
    rating: 4,
    name: 'Eugenia Moore',
    position: 'CTO of Airbnb'
  },
  {
    desc: "All the requirements for developers have been taken into consideration, so I'm able to build any interface I want.",
    svg: <Continental color='#F39409' />,
    rating: 5,
    name: 'Sara Smith',
    position: 'Founder of Continental'
  },
  {
    desc: "I've never used a theme as versatile and flexible as Vuexy. It's my go to for building dashboard sites on almost any project.",
    svg: <Dribbble color='#ea4c89' />,
    rating: 5,
    name: 'Tommy haffman',
    position: 'Founder of Hubspot'
  },
  {
    desc: "I've never used a theme as versatile and flexible as Vuexy. It's my go to for building dashboard sites on almost any project.",
    svg: <Eckerd color='#2882C3' />,
    rating: 5,
    name: 'Eugenia Moore',
    position: 'Founder of Hubspot',
    color: '#2882C3'
  },
  {
    desc: 'Materio is awesome, and I particularly enjoy knowing that if I get stuck on something.',
    svg: <Levis color='#A8112E' />,
    rating: 5,
    name: 'Tommy haffman',
    position: 'Founder of Levis'
  },
  {
    desc: "This template is superior in so many ways. The code, the design, the regular updates, the support.. It's the whole package. Excellent Work.",
    svg: <Airbnb color='#FF5A60' />,
    rating: 4,
    name: 'Eugenia Moore',
    position: 'CTO of Airbnb'
  },
  {
    desc: "All the requirements for developers have been taken into consideration, so I'm able to build any interface I want.",
    svg: <Continental color='#F39409' />,
    rating: 5,
    name: 'Sara Smith',
    position: 'Founder of Continental'
  },
  {
    desc: 'Materio is awesome, and I particularly enjoy knowing that if I get stuck on something.',
    svg: <Dribbble color='#ea4c89' />,
    rating: 5,
    name: 'Tommy haffman',
    position: 'Founder of Levis'
  }
]

const CustomerReviews = () => {
  // States
  const [loaded, setLoaded] = useState<boolean>(false)
  const [currentSlide, setCurrentSlide] = useState<number>(0)
  const [details, setDetails] = useState<TrackDetails>()

  // Hooks
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      slideChanged: slider => setCurrentSlide(slider.track.details.rel),
      created: () => setLoaded(true),
      detailsChanged: s => setDetails(s.track.details),
      slides: {
        perView: 4,
        origin: 'center'
      },
      breakpoints: {
        '(max-width: 1200px)': {
          slides: {
            perView: 3,
            spacing: 26,
            origin: 'center'
          }
        },
        '(max-width: 900px)': {
          slides: {
            perView: 2,
            spacing: 26,
            origin: 'center'
          }
        },
        '(max-width: 600px)': {
          slides: {
            perView: 1,
            spacing: 26,
            origin: 'center'
          }
        }
      }
    },
    [
      slider => {
        let timeout: ReturnType<typeof setTimeout>
        const mouseOver = false

        function clearNextTimeout() {
          clearTimeout(timeout)
        }

        function nextTimeout() {
          clearTimeout(timeout)
          if (mouseOver) return
          timeout = setTimeout(() => {
            slider.next()
          }, 2000)
        }

        slider.on('created', nextTimeout)
        slider.on('dragStarted', clearNextTimeout)
        slider.on('animationEnded', nextTimeout)
        slider.on('updated', nextTimeout)
      }
    ]
  )

  const scaleStyle = (idx: number) => {
    if (!details) return {}
    const activeSlideIndex = details.rel

    return {
      transition: 'transform 0.2s ease-in-out, opacity 0.2s ease-in-out',
      ...(activeSlideIndex === idx ? { transform: 'scale(1)', opacity: 1 } : { transform: 'scale(0.9)', opacity: 0.5 })
    }
  }

  return (
    <section className='flex flex-col gap-16 plb-[100px]'>
      <div className={classnames('flex flex-col items-center justify-center', frontCommonStyles.layoutSpacing)}>
        <div className='flex items-center justify-center mbe-6 gap-3'>
          <Lines />
          <Typography color='text.primary' className='font-medium uppercase'>
            Real Customers Reviews
          </Typography>
        </div>
        <div className='flex items-center gap-2 mbe-1'>
          <Typography variant='h4' className='font-bold'>
            Success stories
          </Typography>
          <Typography variant='h5'>from clients</Typography>
        </div>
        <Typography color='text.secondary' className='font-medium text-center'>
          See what our customers have to say about their experience.
        </Typography>
      </div>
      <AppKeenSlider>
        <>
          <div ref={sliderRef} className='keen-slider mbe-6'>
            {data.map((item, index) => (
              <div key={index} className='keen-slider__slide flex p-6 sm:p-4'>
                <Card elevation={8} className='flex items-center' style={scaleStyle(index)}>
                  <CardContent className='p-8 items-center mlb-auto'>
                    <div className='flex flex-col gap-4 items-center justify-center text-center'>
                      {item.svg}
                      <Typography color='text.primary'>{item.desc}</Typography>
                      <Rating value={item.rating} readOnly />
                      <div>
                        <Typography color='text.primary' className='font-medium'>
                          {item.name}
                        </Typography>
                        <Typography variant='body2'>{item.position}</Typography>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
          {loaded && instanceRef.current && (
            <div className='swiper-dots'>
              {[...Array(instanceRef.current.track.details.slides.length).keys()].map(idx => {
                return (
                  <Badge
                    key={idx}
                    variant='dot'
                    component='div'
                    className={classnames({ active: currentSlide === idx })}
                    onClick={() => instanceRef.current?.moveToIdx(idx)}
                  />
                )
              })}
            </div>
          )}
        </>
      </AppKeenSlider>
      <div className='flex flex-wrap items-center justify-center gap-x-16 gap-y-6 mli-3'>
        <Levis color='var(--mui-palette-text-secondary)' />
        <Continental color='var(--mui-palette-text-secondary)' />
        <Airbnb color='var(--mui-palette-text-secondary)' />
        <Eckerd color='var(--mui-palette-text-secondary)' />
        <Dribbble color='var(--mui-palette-text-secondary)' />
      </div>
    </section>
  )
}

export default CustomerReviews
