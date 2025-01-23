<p align="center">
  <a href="./README_En.md">English</a> |
  <a href="./README.md">简体中文</a>
</p>

# Ai-to-pptx
Ai-to-pptx是使用AI技术来自动生成PPTX，并且支持在线修改和导出PPTX。
主要功能:
- 1 使用DeepSeek等大语言模型来生成大纲
- 2 生成的内容允许用户再次修改
- 3 生成PPTX的时候可以选择不同的模板
- 4 支持在线修改PPTX的文字内容，样式，图片等
- 5 支持导出PPTX，PDF，PNG等多种格式(导出PPTX完成, PDF开发中)
- 6 支持用户设置单独的LOGO和相关背景图片,打造用户专属的PPTX风格(未完成)
- 7 支持用户设计自己的模板上传到共享平台,分享给其它人使用(未完成)

# 项目链接
- 1 Ai-to-pptx 项目前端: https://github.com/chatbookai/ai-to-pptx
- 2 Ai-to-pptx PHP后端: https://github.com/chatbookai/ai-to-pptx-backend

# 前端项目运行
```
安装: npm install

开发: npm run dev

打包: npm run build

后端API配置: src/views/AiPPTX/config.ts
如果你需要自己建设一个独立的后端服务,建设完成以后,需要把这个文件的地址更换为你的后端的API地址.

修改产品名称: src/configs/auth.ts 中的 AppName
修改界面颜色: src/configs/auth.ts 中的 mode
```

# 后端项目运行
  1 支持Docker镜像部署
  2 支持手动独立部署PHP环境
  3 具体步骤请见: https://github.com/chatbookai/ai-to-pptx-backend

# 如何制作Ai-to-pptx项目的PPTX模板
  请参考 [如何制作 PPTX 模板](README_Make_Template.md) 文件以获取详细说明。

# Ai-To-PPTX 开源协议
    1 本项目发行协议: [AGPL-3.0 License]
    2 根据GPL协议的内容, 您只有在修改了本系统代码的时候, 需要公开的代码仓库如Github上面, 开放你的修改内容.
    3 如果你不想公开代码的修改内容, 请联系我们取得商业授权.
    4 如果没有修改本系统的代码, 那么你一直可以使用, 在GPL授权协议下面使用本软件.
    5 你的系统需要对所有用户开放的你的源代码, 你修改后的代码也必须要采用GPL协议.
    6 如何你修改了本系统的代码, 你需要在代码和正式使用的系统中标记你使用的哪部分代码是我们的, 哪部分代码是你们自己开发的.你们自己开发的代码也需要采用GPL协议.
    7 GPL协议允许修改软件代码, 但没有允许你修改本系统的著作权人信息, 所以像版权归我们所有之类的标记, 不能去除.

# Ai-To-PPTX 开源版本限制性
    1 没有会员功能,不能让用户注册,计费和充值功能. 但是增加这些功能不难, 相信大家都会.
    2 目前只支持在PPTX的详细页面里面, 输出三个小节的情况, 如果是两个或是四个小节的情况, 暂时还没有做充分测试, 所以目前先保持三个小节的情况.
    3 没有移动端功能.
    4 更多特性,可以考虑采购商业版本.

# Ai-To-PPTX 商业用途
    开源商用: 无需联系,可以直接使用,需要在您官网页面底部增加您的开源库的URL(根据开源协议你需要公开你的源代码),GPL协议授权你可以修改代码,并共享你修改以后的代码,但没有授权你可以修改版权信息,所以版权信息不能修改. GPL协议允许修改软件代码, 但没有允许你修改本系统的著作权人信息, 所以像版权归我们所有之类的标记, 不能去除.
    闭源商用: 需要联系,额外取得商业授权,根据商业授权协议的内容,来决定你是否可以合法的修改版权信息.
    商业授权: 请单独联系. 允许购买商业授权的用户开展SAAS等会员收费业务,以及自用. 但是禁止以系统的方式出售给其它用户,即禁止二次销售. 
    模板开发: 如果计划购买商业授权的用户自已开发出一些特有的PPTX模板,可以共享给我们,经过审核收录以后,可以充抵一定的商业授权费用.
    技术服务: 可选项目,每年支付一次,主要用于软件二次开发商做二次开发的时候的技术咨询和服务,其它业务场景则不需要支付此费用,具体请咨询.
    额外说明: 本系统指的是计算机软件代码,系统里面带的模板并不是开源项目的一部分.虽然系统会自带四套模板供大家免费使用,但更多模板需要购买模板的授权.

# Ai-To-PPTX 商用版本
    1 目前正在开发当中.
    2 支持会员的注册,充值,查询订单记录等.
    3 支持在线增加PPTX模板
    4 支持Android和IOS移动版本

# Ai-To-PPTX 交流群组
    QQ群: 186411255

### 项目界面
    MUI界面风格，美观大方，适合集成到你的项目里面。
<table>
    <tr>
        <td><img src="https://github.com/chatbookai/ai-to-pptx/blob/main/resources/images/01.png"/></td>
        <td><img src="https://github.com/chatbookai/ai-to-pptx/blob/main/resources/images/02.png"/></td>
    </tr>
    <tr>
        <td><img src="https://github.com/chatbookai/ai-to-pptx/blob/main/resources/images/03.png"/></td>
        <td><img src="https://github.com/chatbookai/ai-to-pptx/blob/main/resources/images/04.png"/></td>
    </tr>
    <tr>
        <td><img src="https://github.com/chatbookai/ai-to-pptx/blob/main/resources/images/05.png"/></td>
        <td><img src="https://github.com/chatbookai/ai-to-pptx/blob/main/resources/images/06.png"/></td>
    </tr>
</table>

# 🌟 Star History
<a href="https://github.com/chatbookai/ai-to-pptx/stargazers" target="_blank" style="display: block" align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=chatbookai/ai-to-pptx&type=Date&theme=dark" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=chatbookai/ai-to-pptx&type=Date" />
    <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=chatbookai/ai-to-pptx&type=Date" />
  </picture>
</a>

<a href="#readme">
    <img src="https://img.shields.io/badge/-返回顶部-7d09f1.svg" alt="#" align="right">
</a>
