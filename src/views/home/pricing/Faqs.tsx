// MUI Imports
import Typography from '@mui/material/Typography'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'

// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import frontCommonStyles from '@views/home/styles.module.css'

// Types
type faqsDataTypes = {
  id: string
  question: string
  answer: string
  defaultExpanded?: boolean
}

// Data
const faqsData: faqsDataTypes[] = [
  {
    id: 'panel1',
    question: 'What counts towards the 100 responses limit?',
    answer:
      'We count all responses submitted through all your forms in a month. If you already received 100 responses this month, you won’t be able to receive any more of them until next month when the counter resets.'
  },
  {
    id: 'panel2',
    question: 'How do you process payments?',
    answer:
      'We accept Visa®, MasterCard®, American Express®, and PayPal®. So you can be confident that your credit card information will be kept safe and secure.',
    defaultExpanded: true
  },
  {
    id: 'panel3',
    question: 'What payment methods do you accept?',
    answer: '2Checkout accepts all types of credit and debit cards.'
  },
  {
    id: 'panel4',
    question: 'Do you have a money-back guarantee?',
    answer: 'Yes. You may request a refund within 30 days of your purchase without any additional explanations.'
  },
  {
    id: 'panel5',
    question: 'I have more questions. Where can I get help?',
    answer: 'Please contact us if you have any other questions or concerns. We’re here to help!'
  }
]

const Faqs = () => {
  return (
    <section className={classnames('md:plb-[100px] plb-[50px]', frontCommonStyles.layoutSpacing)}>
      <div className='flex flex-col text-center gap-2 mbe-6'>
        <Typography variant='h4'>FAQ&apos;s</Typography>
        <Typography>Let us help answer the most common questions.</Typography>
      </div>
      <div>
        {faqsData.map((data, index) => {
          return (
            <Accordion key={index} defaultExpanded={data.defaultExpanded}>
              <AccordionSummary aria-controls={data.id + '-content'} id={data.id + '-header'} className='font-medium'>
                {data.question}
              </AccordionSummary>
              <AccordionDetails className='text-textSecondary'>{data.answer}</AccordionDetails>
            </Accordion>
          )
        })}
      </div>
    </section>
  )
}

export default Faqs
