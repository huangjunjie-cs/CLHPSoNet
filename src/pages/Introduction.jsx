import React from 'react';
import MdPage from '../components/MdPage';


const intro_md = `

## 简介


众所周知，显微镜可以帮助生物科学家更好地观察细胞的内部结构。
而我们的应用希望能够帮助历史研究人员或者历史爱好者不仅关注特定研究人物的关系，而且要认识到这些人物在整个大型社交网络中的作用，我们希望它能够像某些社会问题的计算镜头一样工作。

![我们的框架，该框架包括3个部分：建模，子图提取，计算和可视化。最终的结果包括三个部分：中心度、直接关系和图划分](https://raw.githubusercontent.com/h12345jack/CLSRHF/thesis/imgs/framework.png)

### 和传统的方法的比较

传统的方法特点：

1.  拥有历史学知识的研究者
2.  关注研究对象的直接关系
3.  阅读海量的历史文献资料
4.  将数据列表，撰写论文或书籍

![关键词：expert, directly, literature, paper](http://wx2.sinaimg.cn/large/006C73MUly1fu3kagg4x1j30gg03uwer.jpg)

我们的方法的特点：

1.  数据来自数据库
2.  研究网络
3.  web系统产出结果
4.  任何人都可以访问使用

![关键词：database、network、web、accessiable](http://wx4.sinaimg.cn/large/006C73MUly1fu3kck0y0xj30ge03rwev.jpg)

下表总结了我们的框架和传统的历史学研究的框架的异同。

<tablecaption name="传统的方法和我们的方法的比较" />
|   | 传统的方法           |  我们的方法  |
| ------- | ---------------- | ----------  |
| 数据源  | 历史文献 |  历史数据库 |
| 研究方法 | 定性 | 定量 |
| 研究对象的关系 | 直接关系 | 网络的关系 | 
| 专家知识 | 专业 | 普通 |
| 结果呈现 | 论文，列表 | 网页UI | 

### 框架相关算法

#### 子图抽取

由于通常我们会关注一些节点的联系，而这些节点在网络中的不同位置是重要的影响因素。
因此，我们设计了子图抽取的算法， 对于给定的研究对象，我们称为种子节点，然后设定宽度，从种子节点进行宽度优先搜索。
得到包含种子节点的子图，我们对于该子图的研究既考虑了研究对象，也考虑了研究对象的网络的影响。

<img width="50%" alt="子图抽取算法" src="http://wx2.sinaimg.cn/large/006C73MUly1fu3quxo2csj30sn0qb0yn.jpg" />

### 正负关系网络相关理论<cite>大卫, 伊斯利, 乔恩. 克莱因伯格, 著. 网络, 群体与市场. 2011.</cite>

正负关系网络是指网络的边包括正向的关系(如信任、朋友)和负向的关系(如不信任、敌人)。
而这样的网络事实上存在两种力量（正边友好，负边对立）的对立和统一。结构平衡是理解两种力量之间的张力的基本框架。

#### 结构平衡理论

结构平衡原理的基础是社会心理学理论，源于上世纪 40 年代赫德尔的工作。根据这种推理，称一个或三个“+”形成的三角关系为平衡关系，因为它们没有这些不稳定性因素，而零个或两个“+”形成的三角关系视为不平衡关系。结构平衡理论认为，由于不平衡三角关系是心理压力和心理失调的缘由，人们在人际关系中总是试图让它们尽量地少。因此在现实社会中， 不平衡三角关系要比平衡三角关系少。

![一个或三个“+”形成的三角关系为平衡关系，而零个或两个“+”形成的三角关系视为不平衡关系](http://wx3.sinaimg.cn/large/006C73MUly1fqtn6jhcapj30o007ewfg.jpg)

> 如果一个标记的完全图是平衡的，则要么它的所有节点两两都是朋 友，要么它的节点可以分成两个组 X 和 Y，其中 X 组内的节点两两都是朋 友，Y 组内的节点两两也都是朋友，而 X 组中的每个节点都是 Y 组中每个 节点的敌人

#### 结构平衡的弱形式
在现实网络中，平衡性其实是很难保证的，研究人员发现，在很多情况下，上述两条正关系边和一条负关系边比三条负关系边，更容易出现关系分解。因此人们提出弱平衡性。
对于一个完全图，其边以 + 或 - 标记，如果满足以下条件，则称任意三个节点，均不存在两个正关系边和一个负关系边的连接模式为弱平衡性。

![任意三个节点，均不存在两个正关系边和一个负关系边的连接模式](http://wx3.sinaimg.cn/large/006C73MUly1fqtn9nve9pj30o0078dgq.jpg)

> 如果一个标记的完全图是弱平衡的，则要么它的所有节点可分成不同的组，并且满足同一组中的任意两个节点互为朋友。

结构平衡理论是研究正负关系网络的基础。 

### 图划分

图划分问题可以理解为聚类问题使得类类的不平衡性尽可能的小。它是NP难的，提出了很多启发式方法来解决聚类问题.
如启发式的图划分的方法<cite>Doreian P, Mrvar A. Partitioning signed social networks. Social Networks. 2009 Jan 1;31(1):1-1.</cite>, 社区发现算法<cite>Traag VA, Bruggeman J. Community detection in networks with positive and negative links. Physical Review E. 2009 Sep 21;80(3):036115.</cite>

随着网络表示学习的发展，研究人员开始使用机器学习方法来学习给定网络的节点的低维矢量表示<cite>Wang S, Tang J, Aggarwal C, Chang Y, Liu H. Signed network embedding in social media. InProceedings of the 2017 SIAM international conference on data mining 2017 Jun 30 (pp. 327-335). Society for Industrial and Applied Mathematics.</cite>，可以使用网络表征学习然后进行聚类分析。在本系统中，可以选择不同的算法计算不同的图划分结果。

<img alt="图划分的形式化定义"  width="50%" src="http://wx4.sinaimg.cn/large/006C73MUly1fu3ri63v19j30r20dt78f.jpg" />


`


class Introduction extends React.Component {

    render(){
        return <MdPage md_content={intro_md} />;
    }
}

export default Introduction;
