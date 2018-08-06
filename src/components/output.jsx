import React , {Component} from 'react';
import { Card, Col, Row } from 'antd';
import { Tabs } from 'antd';

import TopPeople from './outputs/part1/topPeople';
import DirectGraph from './outputs/part2/directGraph';
import ForchGraph from './outputs/part3/forchGraph';
import NodeInfo from './outputs/part3/nodeInfo';

const TabPane = Tabs.TabPane;

const node_list = [
  ['3762', [-0.49999989, -0.86602541]], 
  ['1762', [0.49999998, 0.86602546]], 
  ['7364', [-9.99999970e-01, -6.29182054e-08]], 
  ['1493', [1.00000000e+00, 2.45045699e-08]], 
  ['3767', [-0.50000004,  0.8660254 ]], 
  ['1384', [ 0.49999992, -0.86602541]]
];

const name_dict = {
    "3762" : 'Su Xun',
    "1762" : 'Wang Anshi',
    "7364" : 'Zeng Gong',
    "1493" : 'Su Zhe',
    "3767" : 'Su Shi',
    "1384" : 'Ouyang Xiu'
}


const nodes = [
    {
        "label": "1762",
        "id": "1762",
        "name": "1762"
    },
    {
        "label": "1493",
        "id": "1493",
        "name": "1493"
    },
    {
        "label": "3762",
        "id": "3762",
        "name": "3762"
    },
    {
        "label": "1384",
        "id": "1384",
        "name": "1384"
    },
    {
        "label": "7364",
        "id": "7364",
        "name": "7364"
    },
    {
        "label": "3767",
        "id": "3767",
        "name": "3767"
    }
]

const links = [
    {
        "source": "1493",
        "weight": 4.0,
        "target": "1384",
        "id": "25787"
    },
    {
        "source": "1493",
        "weight": 6.0,
        "target": "3767",
        "id": "25812"
    },
    {
        "source": "1493",
        "weight": -1.0,
        "target": "1762",
        "id": "10312"
    },
    {
        "source": "1493",
        "weight": 3.0,
        "target": "3762",
        "id": "24000"
    },
    {
        "source": "1762",
        "weight": 1.0,
        "target": "7364",
        "id": "10285"
    },
    {
        "source": "1762",
        "weight": 0.0,
        "target": "3767",
        "id": "10267"
    },
    {
        "source": "1762",
        "weight": 4.0,
        "target": "1384",
        "id": "10042"
    },
    {
        "source": "3767",
        "weight": 10.0,
        "target": "1384",
        "id": "26871"
    },
    {
        "source": "3767",
        "weight": 4.0,
        "target": "3762",
        "id": "24001"
    },
    {
        "source": "3767",
        "weight": 0.0,
        "target": "7364",
        "id": "27449"
    },
    {
        "source": "7364",
        "weight": 1.0,
        "target": "3762",
        "id": "24008"
    },
    {
        "source": "7364",
        "weight": 7.0,
        "target": "1384",
        "id": "26968"
    },
    {
        "source": "3762",
        "weight": 5.0,
        "target": "1384",
        "id": "24003"
    }
]

const links2 = [
  {
      "source": "1762",
      "target": "7364",
      "id": "8814",
      "weight": 1.0
  },
  {
      "source": "1762",
      "target": "1384",
      "id": "8613",
      "weight": 5.0
  },
  {
      "source": "1762",
      "target": "3767",
      "id": "8796",
      "weight": 1.0
  },
  {
      "source": "1493",
      "target": "3767",
      "id": "22706",
      "weight": 6.0
  },
  {
      "source": "1493",
      "target": "3762",
      "id": "21310",
      "weight": 3.0
  },
  {
      "source": "1493",
      "target": "1384",
      "id": "22712",
      "weight": 4.0
  },
  {
      "source": "3762",
      "target": "1384",
      "id": "21313",
      "weight": 5.0
  },
  {
      "source": "3762",
      "target": "7364",
      "id": "21319",
      "weight": 1.0
  },
  {
      "source": "3762",
      "target": "3767",
      "id": "21311",
      "weight": 4.0
  },
  {
      "source": "1384",
      "target": "7364",
      "id": "23479",
      "weight": 7.0
  },
  {
      "source": "1384",
      "target": "3767",
      "id": "23474",
      "weight": 10.0
  }
]


const links3 = [
  {
      "id": "1249",
      "weight": 0.0,
      "source": "1493",
      "target": "3767"
  },
  {
      "id": "1247",
      "weight": -1.0,
      "source": "1493",
      "target": "1762"
  },
  {
      "id": "3826",
      "weight": 0.0,
      "source": "1384",
      "target": "3767"
  },
  {
      "id": "1618",
      "weight": 0.0,
      "source": "1384",
      "target": "3762"
  },
  {
      "id": "2984",
      "weight": 0.0,
      "source": "1384",
      "target": "7364"
  },
  {
      "id": "4466",
      "weight": -1.0,
      "source": "1384",
      "target": "1762"
  },
  {
      "id": "2981",
      "weight": 0.0,
      "source": "3767",
      "target": "7364"
  },
  {
      "id": "3850",
      "weight": -1.0,
      "source": "3767",
      "target": "1762"
  },
  {
      "id": "2986",
      "weight": 0.0,
      "source": "1762",
      "target": "7364"
  }
]

class Output extends Component {

  render(){
    return (<div>
      <Tabs tabPosition={"top"}>
        <TabPane tab="Top and Central People" key="0">
          <TopPeople
            pos_tie_num={10}
            neg_tie_num={1}
            node_num={6}
          >
          </TopPeople>
        </TabPane>
        <TabPane tab="Direct Relationship" key="1">
         <DirectGraph
         >
         </DirectGraph>
        
        </TabPane>
        <TabPane tab="Group Partition" key="2">
        <Row gutter={10}>
         <Col lg={16} xs={24} id="forced-graph">
          <ForchGraph nodes={nodes} links={links}>
          </ForchGraph>
            </Col>
        
          <Col lg={8} xs={24}>
            <NodeInfo />
          </Col>
        
        </Row>
        </TabPane>
      </Tabs>
      </div>)
  }
  
    
}

export default Output;
