// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Step from '@mui/material/Step'
import Divider from '@mui/material/Divider'
import Stepper from '@mui/material/Stepper'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

import StepperCustomDot from './Components/StepperCustomDot'
import StepperWrapper from 'src/@core/styles/mui/stepper'

import StepOneInputData from './StepOneInputData'
import StepTwoThreeGenerateOutline from './StepTwoThreeGenerateOutline'
import StepFourSelectTemplate from './StepFourSelectTemplate'
import StepFiveGeneratePpt from './StepFiveGeneratePpt'

const steps = [
  {
    title: '开始创作',
    subtitle: '请输入您的要求'
  },
  {
    title: '输入主题',
    subtitle: '输入主题'
  },
  {
    title: '编辑大纲',
    subtitle: '编辑大纲'
  },
  {
    title: '选择模板',
    subtitle: '选择模板'
  },
  {
    title: '制作PTPX',
    subtitle: '制作PTPX'
  }
]

const StepperLinearWithValidation = () => {

  const [activeStep, setActiveStep] = useState<number>(0)
  const [inputData, setInputData] = useState<any>({selectedOption: "inputTopic", inputText: "", importOption: "inputText", moreOption:{language:"zh-CN", moreRequirement:"", outlineLength:"regular" }, outlineContent: '', outlineHtml: '', templateId: 0, pptxContent: null, dataUrl: ''})

  return (
    <Card
        sx={{
          height: 'calc(100vh - 120px)',
          display: 'flex',
          flexDirection: 'column', // 垂直排列
        }}
      >
        {/* 顶部 Stepper 部分 */}
        <CardContent
          sx={{
            flex: '0 0 auto', // 固定高度，不拉伸
          }}
        >
          <StepperWrapper>
            <Stepper activeStep={activeStep}>
              {steps.map((step, index) => {
                const labelProps: { error?: boolean } = {};
                if (index === activeStep) {
                  labelProps.error = false;
                }

                return (
                  <Step key={index}>
                    <StepLabel {...labelProps} StepIconComponent={StepperCustomDot}>
                      <div className='step-label'>
                        <Typography className='step-number'>{`0${index + 1}`}</Typography>
                        <div>
                          <Typography className='step-title'>{step.title}</Typography>
                          <Typography className='step-subtitle'>{step.subtitle}</Typography>
                        </div>
                      </div>
                    </StepLabel>
                  </Step>
                );
              })}
            </Stepper>
          </StepperWrapper>
        </CardContent>

        {/* 分隔线 */}
        <Divider sx={{ m: '0 !important' }} />

        {/* 可滚动的内容部分 */}
        <CardContent
          sx={{
            pt: activeStep === 4 ? 0 : undefined,
            flex: 1, // 占据剩余空间
            overflowY: 'auto', // 内容超出时显示滚动条
          }}
        >
          {activeStep === 0 && (
            <StepOneInputData setActiveStep={setActiveStep} setInputData={setInputData} />
          )}
          {(activeStep === 1 || activeStep === 2) && (
            <StepTwoThreeGenerateOutline
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              inputData={inputData}
              setInputData={setInputData}
            />
          )}
          {activeStep === 3 && (
            <StepFourSelectTemplate
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              inputData={inputData}
              setInputData={setInputData}
            />
          )}
          {activeStep === 4 && (
            <StepFiveGeneratePpt
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              inputData={inputData}
              setInputData={setInputData}
            />
          )}
        </CardContent>
      </Card>

  )
}

export default StepperLinearWithValidation
