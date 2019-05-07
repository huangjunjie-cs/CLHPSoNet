import React from 'react';
import MdPage from '../components/MdPage';

const intro_md = `
## 数据

### 数据收集
我们使用[CBDB’s API](https://projects.iq.harvard.edu/cbdb/cbdb-api)收集数据，
然后对数据进行了清洗，根据下列的规则，将人物划分为不同的朝代：

*  已经被标记的朝代
*  出生年份在朝代内
*  死亡年份在朝代内

使用[NetworkX](https://networkx.github.io/)进行了统计，得到以下图表：

<tablecaption name="不同朝代数据统计" />
|  朝代 |  节点数  | 边数 |  平均聚类系数  | 平均路径长度 |
| ------- | ---------------- | ---------- |---------- |
| 唐(618, 907)  | 365  |  286 | 0.016 | 1.60 |
| 宋(960, 1279) | 17,114 | 30,330 | 0.121 | 4.08 |
| 元(1271, 1368) | 6,424 | 11,864 | 0.150 | 4.00 |
| 明(1368, 1644) | 8,350 | 14,609 | 0.070 | 4.65 |
| 清(1636, 1912) | 3,128 | 3,059  | 0.021 | 7.71 |


![唐宋元明清各朝代人物度分布](https://raw.githubusercontent.com/huangjunjie95/CLHPSoNet/frontend/public/imgs/degree-distribution.jpg)

从图和表中，可以看出，唐朝的数据不完整呢，而其他朝代的数据呈现幂律分布和小世界现象，由于宋代的数据相对比较完整。
而且宋代历史上发生了两次有名的改革，会有更多的政治矛盾。我们选用宋代的数据进一步进行建模。使用[gephi](https://gephi.org/)进行可视化，以王安石为中心，可以发现其处于较为中心的位置，能够在很短的步数内到达其不认识的人物，如秦桧。

![王安石（1021-1086）为中心点，人物出生于1000-1100。 这表明王安石可以以很少的步骤和秦桧（1091-1155）这样的人建立关系](https://raw.githubusercontent.com/huangjunjie95/CLHPSoNet/frontend/public/imgs/wanganshi-center.jpg)

### 数据建模
我们对边进行了统计分析，并且手工的按照历史材料的记载，对边的正负关系进行区分，规则如下图：

![正负关系划分标准top10](https://raw.githubusercontent.com/huangjunjie95/CLHPSoNet/frontend/public/imgs/data-modeling.jpg)

并且计算了相应的中心性，对那些重要的人物进行了离线统计分析，方便研究者调用。


`

class Dataset extends React.Component {

    render(){
        return <MdPage md_content={intro_md} />
    }
}
export default Dataset;