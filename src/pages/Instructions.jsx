import React from 'react';
import MdPage from '../components/MdPage';

const intro_md = `

## 使用说明

![我们的框架模型](https://raw.githubusercontent.com/huangjunjie95/CLHPSoNet/frontend/public/imgs/framework.png)

框架流程如图所示，包括以下几个部分：

1.  建模数据
2.  用户输入
3.  可视化报告产出

其中，用户需要进行交互的部分主要是输入：

1.  种子人物
2.  种子人物的宽度
3.  图划分算法

而系统产出包括三个部分:

1.  中心人物
2.  人物直接连接情况
3.  图划分结果

### 以唐宋八大家中宋6人为例

![唐宋八大家，是中国唐代韩愈、柳宗元和宋代欧阳修、苏洵、苏轼、苏辙、曾巩、王安石八位散文家的合称，而宋代的6人是同一时期的人物，研究他们的相关关系是一个时常被讨论的话题](https://raw.githubusercontent.com/huangjunjie95/CLHPSoNet/frontend/public/imgs/eight-master.jpg)

唐宋八大家之宋代欧阳修、苏洵、苏轼、苏辙、曾巩、王安石是同一时期的人物，研究他们的相关关系是一个时常被讨论的话题，其中王安石与欧阳修的师生情缘，王和三苏的政治争辩也是被历史学家和历史爱好者津津乐道，如[王安石、苏东坡、欧阳修三人到底什么关系](https://www.zhihu.com/question/20589740)。而我们的框架和系统同样能够给出一些有趣的结果。具体使用是首先输入种子用户，然后选择深度和算法，点击确定，得到相应的输入和中心性产出，直接关系与详情和组划分三部分结果的报告。


![输入和中心性产出](https://raw.githubusercontent.com/huangjunjie95/CLHPSoNet/frontend/public/imgs/use1.jpg)

查看直接关系，点击对应连边查看详情：

![直接关系与详情](https://raw.githubusercontent.com/huangjunjie95/CLHPSoNet/frontend/public/imgs/use2.jpg)

查看图分割结果，点击节点查看人物画像：

![三苏被分在了一个组，而另一个组为剩余3人](https://raw.githubusercontent.com/huangjunjie95/CLHPSoNet/frontend/public/imgs/use3.jpg)

`


class Instructions extends React.Component {

    render(){
            return <MdPage md_content={intro_md} />;
    }

}

export default Instructions;
