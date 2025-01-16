import { useState, useEffect } from 'react'
import { BackendApi } from './Config'

import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

import { PlayCircleFilled } from "@mui/icons-material";
import { ArrowBack } from '@mui/icons-material';

const StepFourSelectTemplate = ({activeStep, setActiveStep, inputData, setInputData, token}: any) => {

    const [templateId, setTemplateId] = useState('')
    const [templates, setTemplates] = useState([] as any)

    console.log("inputDatainputData0001", inputData, activeStep)

    const loadTemplates = async () => {
        const url = BackendApi + 'randomTemplates.php'
        const resp = await (await fetch(url, {
            method: 'POST',
            headers: {
                'token': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ page: 1, size: 28, filters: { type: 1 } })
        })).json()
        if (resp.code != 0) {
            alert('获取模板异常：' + resp.message)

            return
        }
        setTemplates(resp.data || [])
        selectTemplate(resp.data[0])
    }

    const selectTemplate = (template: any) => {
        setInputData((prevState: any) => ({...prevState, templateId: template.id}))
        setTemplateId(template.id)
    }

    useEffect(() => {
        loadTemplates()
    }, [])

    return (
      <>
        <Grid container justifyContent="center" sx={{ marginBottom: 2 }}>
          <Grid item>
            <Button
              variant="outlined"
              onClick={() => setActiveStep((prevActiveStep: number) => prevActiveStep - 1)}
              startIcon={<ArrowBack />}
              sx={{mx: 1}}
            >
              上一步
            </Button>
            <Button
              variant="contained"
              onClick={() => setActiveStep((prevActiveStep: number) => prevActiveStep + 1)}
              startIcon={<PlayCircleFilled />}
              sx={{mx: 1}}
            >
              下一步：生成PPTX
            </Button>
          </Grid>
        </Grid>

        <Grid container sx={{ mb: 2, px: 4 }}>
          {templates.map((template: any) => (
            <Grid
              item
              xs={12}
              sm={4}
              md={4}
              lg={3}
              key={template.id}
              onClick={() => selectTemplate(template)}
            >
              <Grid item sx={{
                m: 1,
                cursor: 'pointer', // 鼠标悬停时显示手型
                border: template.id === templateId ? '2px solid #1976d2' : '1px solid #ddd', // 选中时边框颜色
                borderRadius: '8px', // 圆角
                overflow: 'hidden', // 防止图片溢出
              }}>
                <img
                  src={`${BackendApi}json/${template.subject}.png`}
                  alt={template.subject}
                  style={{ width: '100%', height: 'auto' }} // 缩小图片宽度为 80%
                />
              </Grid>
            </Grid>
          ))}
          {templates.length === 0 && (
            <Grid container justifyContent="center" alignItems="center">
              <Grid item xs={12}>
                <Box display="flex" justifyContent="center" alignItems="center" sx={{mt: 2}}>
                  <div>模板加载中...</div>
                </Box>
              </Grid>
            </Grid>
          )}
        </Grid>
      </>
    )
}

export default StepFourSelectTemplate
