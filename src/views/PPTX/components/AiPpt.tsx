import { useState, useEffect } from 'react'
import GenerateOutline from './GenerateOutline'
import SelectTemplate from './SelectTemplate'
import GeneratePpt from './GeneratePpt'

// 文多多AiPPT
// 官网 https://docmee.cn
// 开放平台 https://docmee.cn/open-platform/api#接口鉴权

// api key
const apiKey = 'ak_64m31P5v3v6r5AMWBI'
const uid = 'test1'


function AiPpt() {
  const [step, setStep] = useState(3)
  const [outline, setOutline] = useState('# outline_content\n## 概念与定义\n### outline_content的含义\n#### 定义\n#### 重要性\n#### 应用场景\n### 相关术语\n#### 术语解释\n#### 常见误区\n#### 术语发展历程\n## 大纲的结构\n### 基本构成\n#### 主题\n#### 章节\n#### 页面的重要性\n### 设计原则\n#### 简洁性\n#### 逻辑性\n#### 可读性\n## 创建大纲的步骤\n### 初步构思\n#### 主题选择\n#### 目标受众分析\n#### 关键信息梳理\n### 细化内容\n#### 章节规划\n#### 页面安排\n#### 内容深度确定\n## 大纲的应用\n### 在演示中的作用\n#### 结构清晰\n#### 引导观众\n#### 提高效率\n### 在写作中的优势\n#### 逻辑条理\n#### 思路整理\n#### 便于修改\n## 常见问题与解决方案\n### 大纲不清晰\n#### 问题分析\n#### 解决策略\n### 内容过于冗长\n#### 问题原因\n#### 压缩技巧\n### 疏漏和遗漏\n#### 常见疏漏\n#### 检查方法\n## 未来发展趋势\n### 数字化大纲\n#### 工具与平台\n#### 对比传统方式\n### 人工智能的应用\n#### AI辅助大纲生成\n#### 对创作的影响\n### 大纲设计的创新\n#### 新方法\n#### 未来展望\n')
  const [dataUrl, setDataUrl] = useState()
  const [templateId, setTemplateId] = useState('1815665745196212224')
  const [token, setToken] = useState('sk_R4l3xMsv5pEEsv2ZTE')

  async function createApiToken() {
    if (!apiKey) {
      alert('请在代码中设置apiKey')

      return
    }
    const url = 'https://docmee.cn/api/user/createApiToken'
    const resp = await (await fetch(url, {
      method: 'POST',
      headers: {
        'Api-Key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uid,
        limit: null
      })
    })).json()
    if (resp.code != 0) {
      alert('创建接口token异常：' + resp.message)

      return
    }
    setToken(resp.data.token)
  }

  useEffect(() => {
    createApiToken()
  }, [])

  return (
    <>
      <div>
        {step == 1 && (
            <GenerateOutline token={token} nextStep={(params)=> {
                setStep(step => step + 1)
                setOutline(() => params.outline)
                setDataUrl(() => params.dataUrl)
            }} />
        )}
        {step == 2 && (
            <SelectTemplate token={token} nextStep={(id)=> {
                setStep(step => step + 1)
                setTemplateId(() => id)
            }} />
        )}
        {step == 3 && (
            <GeneratePpt token={token} params={{templateId, outline, dataUrl}} />
        )}
      </div>
    </>
  )
}

export default AiPpt
