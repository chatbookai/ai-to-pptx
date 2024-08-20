// MUI Imports
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import frontCommonStyles from '@views/home/styles.module.css'

const NeedHelp = () => {
  return (
    <section
      className={classnames(
        'flex flex-col justify-center items-center gap-4 md:plb-[100px] plb-[50px]',
        frontCommonStyles.layoutSpacing
      )}
    >
      <Typography variant='h4' className='text-center'>
        Still need help?
      </Typography>
      <Typography className='text-center'>
        Our specialists are always happy to help. Contact us during standard business hours or email us 24/7, and
        we&apos;ll get back to you.
      </Typography>
      <div className='flex gap-4'>
        <Button variant='contained'>Visit our community</Button>
        <Button variant='contained'>Contact Us</Button>
      </div>
    </section>
  )
}

export default NeedHelp
