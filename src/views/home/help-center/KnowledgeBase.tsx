// Next Imports
import Link from 'next/link'

// MUI Imports
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import CustomAvatar from '@/@core/components/mui/Avatar'

// Styles Imports
import frontCommonStyles from '@views/home/styles.module.css'

// Types
type popularArticlesType = {
  title: string
  icon: string
  articles: { title: string }[]
}

// Data
const allArticles: popularArticlesType[] = [
  {
    title: 'Buying',
    icon: 'ri-shopping-cart-line',
    articles: [
      { title: 'What are Favourites?' },
      { title: 'How do I purchase an item?' },
      { title: 'How do i add or change my details?' },
      { title: 'How do refunds work?' },
      { title: 'Can I Get A Refund?' },
      { title: "I'm trying to find a specific item" }
    ]
  },
  {
    title: 'Item Support',
    icon: 'ri-question-line',
    articles: [
      { title: 'What is Item Support?' },
      { title: 'How to contact an author?' },
      { title: 'Where Is My Purchase Code?' },
      { title: 'Extend or renew Item Support' },
      { title: 'Item Support FAQ' },
      { title: 'Why has my item been removed?' }
    ]
  },
  {
    title: 'Licenses',
    icon: 'ri-file-text-line',
    articles: [
      { title: 'Can I use the same license for the...' },
      { title: 'How to contact an author?' },
      { title: "I'm making a test site - it's not for ..." },
      { title: 'which license do I need?' },
      { title: 'I want to make multiple end prod ...' },
      { title: 'For logo what license do I need?' }
    ]
  },
  {
    title: 'Template Kits',
    icon: 'ri-palette-line',
    articles: [
      { title: 'Template Kits' },
      { title: 'Elementor Template Kits: PHP Zip ...' },
      { title: 'Template Kits - Imported template ...' },
      { title: 'Troubleshooting Import Problems' },
      { title: 'How to use the WordPress Plugin ...' },
      { title: 'How to use the Template Kit Import ...' }
    ]
  },
  {
    title: 'Account & Password',
    icon: 'ri-lock-line',
    articles: [
      { title: 'Signing in with a social account' },
      { title: 'Locked Out of Account' },
      { title: "I'm not receiving the verification email" },
      { title: 'Forgotten Username Or Password' },
      { title: 'New password not accepted' },
      { title: 'What is Sign In Verification?' }
    ]
  },
  {
    title: 'Account Settings',
    icon: 'ri-user-line',
    articles: [
      { title: 'How do I change my password?' },
      { title: 'How do I change my username?' },
      { title: 'How do I close my account?' },
      { title: 'How do I change my email address?' },
      { title: 'How can I regain access to my a ...' },
      { title: 'Are RSS feeds available on Market?' }
    ]
  }
]

const KnowledgeBase = () => {
  return (
    <section className={classnames('flex flex-col gap-6 md:plb-[100px] plb-[50px]', frontCommonStyles.layoutSpacing)}>
      <Typography variant='h4' className='text-center'>
        Knowledge Base
      </Typography>
      <Grid container spacing={6}>
        {allArticles.map((article, index) => {
          return (
            <Grid item xs={12} lg={4} key={index}>
              <Card>
                <CardContent className='flex flex-col items-start gap-6 text-center'>
                  <div className='flex gap-3 items-center'>
                    <CustomAvatar skin='light' variant='rounded' color='primary' size={32}>
                      <i className={classnames('text-xl', article.icon)} />
                    </CustomAvatar>
                    <Typography variant='h5'>{article.title}</Typography>
                  </div>
                  <div className='flex flex-col gap-2 is-full'>
                    {article.articles.map((data, index) => {
                      return (
                        <div key={index} className='flex justify-between items-center gap-2'>
                          <Typography
                            component={Link}
                            href='/front-pages/help-center/article/how-to-add-product-in-cart'
                            color='text.primary'
                          >
                            {data.title}
                          </Typography>
                        </div>
                      )
                    })}
                  </div>
                  <Button
                    component={Link}
                    href='/front-pages/help-center/article/how-to-add-product-in-cart'
                  >
                    See all 6 articles
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>
    </section>
  )
}

export default KnowledgeBase
