// ** React Imports
import { Fragment, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import {
  Description, // 输入主题与要求
  CloudUpload, // 导入外部资料
  TextFields, // 输入文本
  UploadFile, // 上传文件
  Link, // 输入网页地址
  List, // 导入大纲
  KeyboardArrowDown,
  KeyboardArrowRight,
  PlayCircleFilled, // 立即生成
} from "@mui/icons-material";


const StepOneInputData = ({ setActiveStep, setInputData }: any) => {
  // ** States

  // 状态管理
  const [selectedOption, setSelectedOption] = useState("inputTopic"); // 默认选中 "输入主题与要求"
  const [importOption, setImportOption] = useState("inputText"); // 默认选中 "输入文本"
  const [inputText, setInputText] = useState("2025年就业市场预测"); // 输入框内容
  const [showMoreOptions, setShowMoreOptions] = useState(false); // 是否显示更多生成要求
  const [moreOptions, setMoreOptions] = useState({ moreRequirement: "", language: "zh-CN", outlineLength: "regular" }); // 更多生成要求的内容

  // 处理选项切换
  const handleOptionChange = (option: any) => {
    setSelectedOption(option);
  };

  // 处理导入选项切换
  const handleImportOptionChange = (option: any) => {
    setImportOption(option);
  };

  // 处理更多生成要求的显示/隐藏
  const toggleMoreOptions = () => {
    setShowMoreOptions(!showMoreOptions);
  };

  // 处理立即生成按钮点击
  const handleGenerateOutline = () => {
    console.log("生成 PPTX 的参数：", {
      selectedOption,
      importOption,
      inputText,
      moreOptions,
    });
    setInputData((prevState: any) => ({...prevState, selectedOption, importOption, inputText, moreOptions}))
    setActiveStep((prevActiveStep: number) => prevActiveStep + 1)
  };

  return (
    <Box sx={{  }}>
      {/* 第一行：两个按钮 */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Button
          variant={selectedOption === "inputTopic" ? "contained" : "outlined"}
          color={selectedOption === "inputTopic" ? "primary" : "inherit"}
          onClick={() => handleOptionChange("inputTopic")}
          startIcon={<Description />} // 输入主题与要求图标
        >
          输入主题与要求
        </Button>
        <Button
          variant={selectedOption === "importData" ? "contained" : "outlined"}
          color={selectedOption === "importData" ? "primary" : "inherit"}
          onClick={() => handleOptionChange("importData")}
          startIcon={<CloudUpload />} // 导入外部资料图标
        >
          导入外部资料（网络/文件等）
        </Button>
      </Box>

      {/* 第二行：根据选项显示不同内容 */}
      {selectedOption === "inputTopic" && (
        <TextField
          fullWidth
          label="请输入主题与要求"
          variant="outlined"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          sx={{ mt: 2, mb: 2 }}
        />
      )}

      {selectedOption === "importData" && (
        <>
          {/* 四个按钮 */}
          <Box sx={{ display: "flex", gap: 2, mb: 2, mt: 4 }}>
            <Button
              variant={importOption === "inputText" ? "contained" : "outlined"}
              color={importOption === "inputText" ? "primary" : "inherit"}
              onClick={() => handleImportOptionChange("inputText")}
              startIcon={<TextFields />}
            >
              输入文本
            </Button>
            <Button
              variant={importOption === "uploadFile" ? "contained" : "outlined"}
              color={importOption === "uploadFile" ? "primary" : "inherit"}
              onClick={() => handleImportOptionChange("uploadFile")}
              startIcon={<UploadFile />}
            >
              上传文件
            </Button>
            <Button
              variant={importOption === "inputUrl" ? "contained" : "outlined"}
              color={importOption === "inputUrl" ? "primary" : "inherit"}
              onClick={() => handleImportOptionChange("inputUrl")}
              startIcon={<Link />}
            >
              输入网页地址
            </Button>
            <Button
              variant={importOption === "importOutline" ? "contained" : "outlined"}
              color={importOption === "importOutline" ? "primary" : "inherit"}
              onClick={() => handleImportOptionChange("importOutline")}
              startIcon={<List />}
            >
              导入大纲
            </Button>
          </Box>

          {/* 动态显示输入框 */}
          {importOption === "inputText" && (
            <TextField
              fullWidth
              label="请输入文本"
              variant="outlined"
              multiline
              rows={4}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              sx={{ mb: 2, mt: 2 }}
            />
          )}

          {importOption === "inputUrl" && (
            <TextField
              fullWidth
              label="请输入网页地址"
              variant="outlined"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              sx={{ mb: 2, mt: 2 }}
            />
          )}
        </>
      )}

      {/* 更多生成要求 */}
      <Button
        variant="text"
        color="primary"
        onClick={toggleMoreOptions}
        sx={{ cursor: "pointer", mb: 2 }}
        endIcon={
          showMoreOptions ? (
            <KeyboardArrowRight sx={{ verticalAlign: "middle" }} />
          ) : (
            <KeyboardArrowDown sx={{ verticalAlign: "middle" }} />
          )
        }
      >
        更多生成要求
      </Button>

      {showMoreOptions && (
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            size={"small"}
            label="请输入更多要求"
            variant="outlined"
            value={moreOptions.moreRequirement}
            onChange={(e) =>
              setMoreOptions({ ...moreOptions, moreRequirement: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          {/* 大纲篇幅选择 */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body1">大纲篇幅:</Typography>
            <Select
              size={'small'}
              value={moreOptions.outlineLength}
              onChange={(e) =>
                setMoreOptions({ ...moreOptions, outlineLength: e.target.value })
              }
              displayEmpty
              sx={{my: 1}}
            >
              <MenuItem value="" disabled>
                请选择
              </MenuItem>
              <MenuItem value="short">较短 10-15 页</MenuItem>
              <MenuItem value="regular">常规 20-30 页</MenuItem>
              <MenuItem value="long">更长 25-35 页</MenuItem>
            </Select>
          </Box>
          {/* 下拉框和文本提示 */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body1">选择语言:</Typography>
            <Select
              size={"small"}
              value={moreOptions.language}
              onChange={(e) =>
                setMoreOptions({ ...moreOptions, language: e.target.value })
              }
              displayEmpty
              sx={{my: 1}}
            >
              <MenuItem value="" disabled>
                请选择
              </MenuItem>
              <MenuItem value="zh-CN">中文</MenuItem>
              <MenuItem value="en">英文</MenuItem>
            </Select>
          </Box>
        </Box>
      )}

      <Grid container justifyContent="center">
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGenerateOutline}
            startIcon={<PlayCircleFilled />}
          >
            立即生成
          </Button>
        </Grid>
      </Grid>

    </Box>
  )
}

export default StepOneInputData
