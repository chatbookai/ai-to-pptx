// React Imports
import type { ReactNode } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'

// SVG Imports
import Gift from '@assets/svg/front-pages/help-center/Gift'
import Rocket from '@assets/svg/front-pages/help-center/Rocket'
import File from '@assets/svg/front-pages/help-center/File'

// Styles Imports
import frontCommonStyles from '@views/home/styles.module.css'

// Types
type popularArticlesType = {
  slug: string
  title: string
  svg: ReactNode
  subtitle: string
}

// Data
const popularArticles: popularArticlesType[] = [
  {
    slug: 'getting-started',
    title: 'Getting Started',
    svg: <Rocket />,
    subtitle: "Whether you're new or you're a power user, this article will"
  },
  {
    slug: 'first-steps',
    title: 'First Steps',
    svg: <Gift />,
    subtitle: 'Are you a new customer & wondering how to get started?'
  },
  {
    slug: 'external-content',
    title: 'Add External Content',
    svg: <File />,
    subtitle: 'Article will show you how to expand the functionality of App'
  }
]

const Articles = () => {
  return (
    <section className='md:plb-[100px] plb-[50px] bg-backgroundPaper'>
      <div className={frontCommonStyles.layoutSpacing}>
        <Typography variant='h4' className='text-center mbe-6'>
          Popular Articles
        </Typography>
        <Grid container spacing={6}>
          {popularArticles.map((article, index) => {
            return (
              <Grid item xs={12} lg={4} key={index}>
                <Card className='shadow-none border'>
                  <CardContent className='flex flex-col items-center justify-center gap-3 text-center'>
                    {article.svg}
                    <Typography variant='h5'>{article.title}</Typography>
                    <Typography>{article.subtitle}</Typography>
                    <Button
                      component={Link}
                      href='/front-pages/help-center/article/how-to-add-product-in-cart'
                      variant='outlined'
                    >
                      Read More
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      </div>
    </section>
  )
}

export default Articles
