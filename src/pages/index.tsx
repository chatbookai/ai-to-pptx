// ** React Imports
import { useState } from 'react';

import AiPPTX from 'src/views/AiPPTX/AiPPTX'
import Setting from 'src/views/AiPPTX/Setting'

import { ReactNode } from 'react'

import { Box, Button } from '@mui/material';

import BlankLayout from 'src/@core/layouts/BlankLayout'

const AiPPTXModel = () => {

  const handleButtonClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer'); // 打开新窗口
  };

  const [pageMode, setPageMode] = useState("AiToPPTX");

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      <Box sx={{ padding: 3 }}>
        {pageMode == "AiToPPTX" && <AiPPTX />}
        {pageMode == "Setting" && <Setting />}
      </Box>
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'background.paper',
          padding: 2,
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
          boxShadow: 3,
        }}
      >
        <Button
          size={'small'}
          variant="outlined"
          onClick={() => handleButtonClick('https://github.com/chatbookai/ai-to-pptx')}
        >
          项目前端
        </Button>
        <Button
          size={'small'}
          variant="outlined"
          onClick={() => handleButtonClick('https://github.com/chatbookai/ai-to-pptx-backend')}
        >
          项目后端
        </Button>
        <Button
          size={'small'}
          variant="outlined"
          onClick={() => handleButtonClick('https://pptx.dandian.net/')}
        >
          演示站点
        </Button>
        <Button
          size={'small'}
          variant={pageMode == "AiToPPTX" ? "contained" : "outlined"}
          onClick={() => setPageMode('AiToPPTX')}
        >
          AiToPPTX
        </Button>
        <Button
          size={'small'}
          variant={pageMode == "Setting" ? "contained" : "outlined"}
          onClick={() => setPageMode('Setting')}
        >
          参数设置
        </Button>
      </Box>
    </Box>
  )
}

AiPPTXModel.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

AiPPTXModel.guestGuard = true

export default AiPPTXModel
