// React Imports
import { useState } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { ThemeColor } from '@/@core/types'

// Component Imports
import CustomAvatar from '@/@core/components/mui/Avatar'

// Styles Imports
import frontCommonStyles from '@views/home/styles.module.css'

// Type
type StatData = {
  title: string
  value: number
  icon: string
  color: ThemeColor
  isHover: boolean
}

// Data
const statData: StatData[] = [
  {
    title: '模型数量',
    value: 20,
    icon: 'ri-layout-line',
    color: 'primary',
    isHover: false
  },
  {
    title: '用户数量',
    value: 1000,
    icon: 'ri-time-line',
    color: 'success',
    isHover: false
  },
  {
    title: '生成PPTX数量',
    value: 5000,
    icon: 'ri-user-smile-line',
    color: 'warning',
    isHover: false
  },
  {
    title: '支持平台',
    value: 4,
    icon: 'ri-award-line',
    color: 'info',
    isHover: false
  }
]

const ProductStat = () => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  return (
    <section className='plb-[40px] bg-backgroundPaper'>
      <div className={frontCommonStyles.layoutSpacing}>
        <Grid container spacing={6}>
          {statData.map((stat, index) => (
            <Grid item key={index} xs={6} md={3}>
              <div className='flex flex-col items-center justify-center gap-6'>
                <CustomAvatar
                  onMouseEnter={() => {
                    setHoverIndex(index)
                  }}
                  onMouseLeave={() => {
                    setHoverIndex(null)
                  }}
                  skin={hoverIndex === index ? 'filled' : 'light'}
                  color={stat.color}
                  size={82}
                  className='cursor-pointer'
                >
                  <i className={classnames(stat.icon, 'text-[2.625rem]')} />
                </CustomAvatar>
                <div className='text-center'>
                  <Typography color='text.primary' className='font-bold text-[34px]'>
                    {stat.value}+
                  </Typography>
                  <Typography className='font-medium' color='text.secondary'>
                    {stat.title}
                  </Typography>
                </div>
              </div>
            </Grid>
          ))}
        </Grid>
      </div>
    </section>
  )
}

export default ProductStat
