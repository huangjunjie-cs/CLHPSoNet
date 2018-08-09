import React from 'react';
import MdPage from '../components/MdPage';

const intro_md = `

## 使用说明

![我们的框架模型](https://raw.githubusercontent.com/h12345jack/CLSRHF/thesis/imgs/framework.png)

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

输入种子用户，选择深度和算法，点击确定，得到相应的报告

![输入和中心性产出](http://wx2.sinaimg.cn/large/006C73MUly1fu3v2uza8rj317t0lgjyo.jpg)

查看直接关系，点击对应连边查看详情：

![直接关系与详情](http://wx4.sinaimg.cn/large/006C73MUgy1fu3v428qabj316p0uf44z.jpg)

查看图分割结果，点击节点查看人物画像：

![三苏被分在了一个组，而另一个组为剩余3人](http://wx3.sinaimg.cn/large/006C73MUgy1fu3v4zlcdzj31gc0v3aoj.jpg)

`


class Instructions extends React.Component {

    render(){
            return <MdPage md_content={intro_md} />;
    }

}

export default Instructions;
