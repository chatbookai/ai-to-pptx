// Next Imports
import Link from 'next/link'

// MUI Imports
import Typography from '@mui/material/Typography'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import InputAdornment from '@mui/material/InputAdornment'
import OutlinedInput from '@mui/material/OutlinedInput'
import FormControl from '@mui/material/FormControl'

// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import frontCommonStyles from '@views/home/styles.module.css'

// Data
const articleList = [
  'Template Kits',
  'Elementor Template Kits: PHP Zip Extends',
  'Envato Elements Template Kits',
  'Envato Elements Template Kits',
  'How to use the template in WordPress',
  'How to use the Template Kit Import'
]

const Questions = () => {
  return (
    <section className='flex flex-col justify-center items-center gap-4 md:plb-[100px] plb-[50px] bg-backgroundPaper pbs-[70px] -mbs-[70px]'>
      <div className={classnames('pbs-10 md:pbs-16', frontCommonStyles.layoutSpacing)}>
        <Grid container spacing={6}>
          <Grid item xs={12} lg={8}>
            <div className='flex flex-col gap-2'>
              <Breadcrumbs aria-label='breadcrumb'>
                <Link className='hover:text-primary' href='/front-pages/help-center'>
                  Help Center
                </Link>
                <Typography className='text-textPrimary'>How to add product in cart</Typography>
              </Breadcrumbs>
              <Typography variant='h4'>How to add product in cart?</Typography>
              <Typography>1 month ago - Updated</Typography>
            </div>
            <Divider className='mlb-6' />
            <div className='flex flex-col gap-6'>
              <div>
                <Typography className='mbe-4'>
                  If you’re after only one item, simply choose the ‘Buy Now’ option on the item page. This will take you
                  directly to Checkout.
                </Typography>
                <Typography>
                  If you want several items, use the ‘Add to Cart’ button and then choose ‘Keep Browsing’ to continue
                  shopping or ‘Checkout’ to finalize your purchase.
                </Typography>
              </div>
              <img src='/images/front-pages/product.png' alt='product image' className='rounded is-full max-is-auto' />
              <Typography>
                You can go back to your cart at any time by clicking on the shopping cart icon at the top right side of
                the page.
              </Typography>
              <img
                src='/images/front-pages/checkout.png'
                alt='checkout image'
                className='rounded is-full max-is-auto'
              />
            </div>
          </Grid>
          <Grid item xs={12} lg={4} className='flex flex-col gap-6'>
            <FormControl fullWidth variant='outlined'>
              <OutlinedInput
                id='outlined-adornment-weight'
                placeholder='Search...'
                startAdornment={
                  <InputAdornment position='start'>
                    <i className='ri-search-line' />
                  </InputAdornment>
                }
                aria-describedby='outlined-weight-helper-text'
                inputProps={{
                  'aria-label': 'weight'
                }}
              />
            </FormControl>
            <div className='flex flex-col gap-4'>
              <div className='pli-5 plb-2 bg-actionHover rounded'>
                <Typography variant='h5'>Articles in this section</Typography>
              </div>
              <div className='flex flex-col gap-4'>
                {articleList.map((article, index) => (
                  <div key={index} className='flex gap-2 justify-between'>
                    <Typography color='text.primary'>{article}</Typography>
                  </div>
                ))}
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    </section>
  )
}

export default Questions
