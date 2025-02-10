// ** React Imports
import { useState } from 'react';

// ** MUI Imports
import Typography from '@mui/material/Typography'; // Importing Typography
import toast from 'react-hot-toast';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import LinkIcon from '@mui/icons-material/Link';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import KeyIcon from '@mui/icons-material/Key';
import SaveIcon from '@mui/icons-material/Save';

import { BackendApi } from './Config'

const Setting = () => {
  // ** States

  // 状态管理
  const [aiApiUrl, setAiApiUrl] = useState(""); // 输入框内容
  const [aiModel, setAiModel] = useState(""); // 输入框内容
  const [aiToken, setAiToken] = useState(""); // 输入框内容

  // 处理立即生成按钮点击
  const handleSaveConfig = async () => {
    try {
      const response = await fetch(BackendApi + 'saveConfig.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ aiApiUrl, aiModel, aiToken })
      });

      const responseData = await response.json();

      if (responseData.status === 'ok') {
        toast.success(responseData.msg);
      } else {
        toast.error(responseData.msg);
      }
    } catch (error: any) {
      toast.error(error.message || '保存配置时发生错误');
    }
  };

  return (
    <Box sx={{ py: 5, px: 10 }}>
      <TextField
        fullWidth
        label="AI API URL"
        variant="outlined"
        value={aiApiUrl}
        onChange={(e) => setAiApiUrl(e.target.value)}
        sx={{ mt: 2, mb: 2 }} // Adjusted width for smaller field
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LinkIcon />
            </InputAdornment>
          ),
        }}
        helperText="例如: https://api.deepseek.com" // Added helper text
      />
      <TextField
        fullWidth
        label="AI Model"
        variant="outlined"
        value={aiModel}
        onChange={(e) => setAiModel(e.target.value)}
        sx={{ mt: 2, mb: 2 }} // Adjusted width for smaller field
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <ModelTrainingIcon />
            </InputAdornment>
          ),
        }}
        helperText="例如: deepseek-chat" // Added helper text
      />
      <TextField
        fullWidth
        label="AI Token"
        variant="outlined"
        value={aiToken}
        onChange={(e) => setAiToken(e.target.value)}
        sx={{ mt: 2, mb: 2 }} // Adjusted width for smaller field
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <KeyIcon />
            </InputAdornment>
          ),
        }}
        helperText="例如: sk-6deec20***********, 请输入你自己的KEY, 如果不需要KEY, 则输入一个任意值就可以." // Added helper text
      />
      <Typography variant="body2">1 支持DeepSeek官方API</Typography>
      <Typography variant="body2">2 支持OpenAI官方以及第三方兼容API</Typography>
      <Typography variant="body2">3 目前只能在 http://localhost 访问的时候,才可以进行保存参数</Typography>
      <Typography variant="body2">4 为了安全期间, 当前界面只用做信息输入, 不会显示系统目前已经有的值</Typography>
      <Grid container justifyContent="center" sx={{ pt: 5, mt: 2, mb: 2 }}>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveConfig}
            startIcon={<SaveIcon />}
          >
            修改配置
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Setting
