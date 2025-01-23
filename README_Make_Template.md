# 如何制作Ai-to-pptx项目的PPTX模板
1 制作一个PPTX示例, 按以下要求制作
  - 1 首页要求: 两个文本元素,一个是标题, 一个是作者. 文本元素有且只能用这么多, 不能多加.
  - 2 目录页要求: 目录文字, 再加上6个标题项, 每一个标题项由序号和内容构成, 这个页面就是需要有6*2+1=13个文本元素. 文本元素有且只能用这么多, 不能多加.
  - 3 章节标题页要求: 两个文本元素,一个是序号, 一个是章节标题. 文本元素有且只能用这么多, 不能多加.
  - 4 章节内容页要求: 
    - 标题+2*2结构: 就是由标题+2组元素构成,每组元素由标题,内容两项构成. 文本元素有且只能用这么多, 不能多加. (设计2-3种这样的布局就可以)
    - 标题+2*3结构: 就是由标题+2组元素构成,每组元素由序号,标题,内容三项构成. 文本元素有且只能用这么多, 不能多加. (设计2-3种这样的布局就可以)
    - 标题+3*2结构: 就是由标题+3组元素构成,每组元素由标题,内容两项构成. 文本元素有且只能用这么多, 不能多加. (这种为经常需要使用到的结构情况, 这种结构最好需要有5-8种不同的页面风格和布局, 减少最后页面风格生重复的概率)
    - 标题+3*3结构: 就是由标题+3组元素构成,每组元素由序号,标题,内容三项构成. 文本元素有且只能用这么多, 不能多加.(这种为经常需要使用到的结构情况, 这种结构最好需要有5-8种不同的页面风格和布局, 减少最后页面风格生重复的概率)
    - 标题+4*2结构: 就是由标题+4组元素构成,每组元素由标题,内容两项构成. 文本元素有且只能用这么多, 不能多加. (设计2-3种这样的布局就可以)
    - 标题+4*3结构: 就是由标题+4组元素构成,每组元素由序号,标题,内容三项构成. 文本元素有且只能用这么多, 不能多加. (设计2-3种这样的布局就可以)

2 把这个PPTX的示例转为JSON
  - 把修改完的PPTX文件, 通过 https://github.com/veasion/ppt2json 转为JSON文件.
  - 非常感谢Veasion为开源事业做的重要贡献.

3 制作一个PPTX的图片,或是直接使用PPTX的首页截图为一个图片.

4 在后端PHP的项目文件中,打开config.inc.php文件,修改$Global_Templates变量, 加入你新的模板就可以. 注意id是需要从0开始的自动增量赋值.

5 把之前做好的PPTX文件和JSON文件放到后端PHP的项目的json目录.
 
6 在前端项目中重新运行就可以看到新的模板了.

7 如果遇到问题, 可以自己多研究.

8 PPTX模板也是有版权的, 请不要把有版权的模板拿来做商业用途.


<table>
    <tr>
        <td><img src="https://github.com/chatbookai/ai-to-pptx/blob/main/resources/guide/01.png"/></td>
        <td><img src="https://github.com/chatbookai/ai-to-pptx/blob/main/resources/guide/02.png"/></td>
    </tr>
    <tr>
        <td><img src="https://github.com/chatbookai/ai-to-pptx/blob/main/resources/guide/03.png"/></td>
        <td><img src="https://github.com/chatbookai/ai-to-pptx/blob/main/resources/guide/04.png"/></td>
    </tr>
    <tr>
        <td><img src="https://github.com/chatbookai/ai-to-pptx/blob/main/resources/guide/05.png"/></td>
        <td><img src="https://github.com/chatbookai/ai-to-pptx/blob/main/resources/guide/06.png"/></td>
    </tr>
    <tr>
        <td><img src="https://github.com/chatbookai/ai-to-pptx/blob/main/resources/guide/07.png"/></td>
        <td><img src="https://github.com/chatbookai/ai-to-pptx/blob/main/resources/guide/08.png"/></td>
    </tr>
</table>
