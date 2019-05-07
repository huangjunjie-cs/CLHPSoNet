import React, { Component } from 'react';
import {Row, Col} from 'antd';
import { Card, Icon } from 'antd';
import ReactMarkdown from 'react-markdown';

import Input from '../components/input';
import Output from '../components/output';
import {compute_it} from '../api';


const title_md = `
## 宋代人物正负关系分析
`
const nodes = {
    "3762": {
        position: [-0.49999989, -0.86602541],
        name: "苏洵",
        centrality: {
            c1: 0.002,
            c2: 0.001,
            PersonID: '3762',
            c4: 0.024,
            EngName: 'Su Xun',
            ChName: '\u8607\u6d35',
            c3: 0.292,
          }
    },
    "1762": {
        position: [0.49999998, 0.86602546], 
        name: "王安石",
        centrality: {
            c1: 0.025,
            c2: 0.054,
            PersonID: '1762',
            c4: 0.138,
            EngName: 'Wang Anshi',
            ChName: '\u738b\u5b89\u77f3',
            c3: 0.361,
        }
    },
    "7364": {
        position: [-9.99999970e-01, -6.29182054e-08], 
        name: "曾巩",
        centrality: {
            c1: 0.011,
            c2: 0.019,
            PersonID: '7364',
            c4: 0.062,
            EngName: 'Zeng Gong',
            ChName: '\u66fe\u978f',
            c3: 0.335,
          }
    },
    "1493": {
        position: [1.00000000e+00, 2.45045699e-08],
        name: "苏辙", 
        centrality: {
            c1: 0.007,
            c2: 0.009,
            PersonID: '1493',
            c4: 0.07,
            EngName: 'Su Zhe',
            ChName: '\u8607\u8f4d',
            c3: 0.338,
          }
    },
    "3767": {
        position: [-0.50000004,  0.8660254],
        name: "苏轼", 
        centrality: {
            c1: 0.029,
            c2: 0.083,
            PersonID: '3767',
            c4: 0.179,
            EngName: 'Su Shi',
            ChName: '\u8607\u8efe',
            c3: 0.38,
        }
    },
    "1384": {
        position: [ 0.49999992, -0.86602541],
        name: "欧阳修",
        centrality: {
            c1: 0.022,
            c2: 0.046,
            PersonID: '1384',
            c4: 0.135,
            EngName: 'Ouyang Xiu',
            ChName: '\u6b50\u967d\u4fee',
            c3: 0.362,
          }
    },
}

const links1 = [
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

const links2 = [
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
];

const links3 = [
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

const link_datas = {
    "directed": false,
    "graph": {
        "mode": "static",
        "edge_default": {}
    },
    "links": [{"value": 4.0, "source": "1493", "target": "1384"}, {"value": 4.0, "source": "1384", "target": "1493"}, {"value": 6.0, "source": "1493", "target": "3767"}, {"value": 6.0, "source": "3767", "target": "1493"}, {"value": -1.0, "source": "1493", "target": "1762"}, {"value": -1.0, "source": "1762", "target": "1493"}, {"value": 3.0, "source": "1493", "target": "3762"}, {"value": 3.0, "source": "3762", "target": "1493"}, {"value": 1.0, "source": "1762", "target": "7364"}, {"value": 1.0, "source": "7364", "target": "1762"}, {"value": 0.0, "source": "1762", "target": "3767"}, {"value": 0.0, "source": "3767", "target": "1762"}, {"value": 4.0, "source": "1762", "target": "1384"}, {"value": 4.0, "source": "1384", "target": "1762"}, {"value": 10.0, "source": "3767", "target": "1384"}, {"value": 10.0, "source": "1384", "target": "3767"}, {"value": 4.0, "source": "3767", "target": "3762"}, {"value": 4.0, "source": "3762", "target": "3767"}, {"value": 0.0, "source": "3767", "target": "7364"}, {"value": 0.0, "source": "7364", "target": "3767"}, {"value": 1.0, "source": "7364", "target": "3762"}, {"value": 1.0, "source": "3762", "target": "7364"}, {"value": 7.0, "source": "7364", "target": "1384"}, {"value": 7.0, "source": "1384", "target": "7364"}, {"value": 5.0, "source": "3762", "target": "1384"}, {"value": 5.0, "source": "1384", "target": "3762"}], "nodes": [{"group": 1, "id": "1762", "label": "1762", "name": "王安石"}, {"group": 2, "id": "1493", "label": "1493", "name": "苏辙"}, {"group": 2, "id": "3762", "label": "3762", "name": "苏洵"}, {"group": 1, "id": "1384", "label": "1384", "name": "欧阳修"}, {"group": 1, "id": "7364", "label": "7364", "name": "曾鞏"}, {"group": 2, "id": "3767", "label": "3767", "name": "苏轼"}],
    "multigraph": false
};

class SignedGraph extends Component {
    state = {
        input: {},
        loading: false,
        disabled: false,

        nodes: {},
        links1: [],
        links2: [],
        links3: [],
        link_datas: {}
    }


    componentDidMount(){
        this.setState({
            loaing: false,
            nodes,
            links1,
            links2,
            links3,
            link_datas
        })
    }

    handleSubmit = (data)=>{
        console.log(data);
        this.setState({
            loading: true
        }, ()=>{
            compute_it(data).then((res)=>{
                const data = res.data;
                this.setState({
                    ...data,
                    loading: false,
                });
            }).catch(err=>{
                this.setState({
                    loading: false,
                    disabled: true,
                });
            })
        })
    }


    render() {
        const {nodes,  links1, links2, links3, link_datas} = this.state;
        const data = {nodes,  links1, links2, links3, link_datas};
        return <div> 
                    <div className="markdown-body"> 
                        <ReactMarkdown source={title_md} escapeHtml={false}/>
                    </div>
                    <div style={{marginLeft: 20, marginRight: 20, marginTop: 20, padding:10,background: '#ECECEC'}}>
                        <Row gutter={20}>
                                <Col md={6} xs={24}>
                                    <Card title='输入'>
                                        <Input
                                            handleSubmit={this.handleSubmit} 
                                        />
                                    </Card>
                                </Col>
                                
                                <Col md={18} xs={24}>
                                    <Card title='输出' loading={this.state.loading}>
                                        {this.state.disabled 
                                            ? <div style={{minHeight:180, textAlign:'center'}}>
                                                <p style={{marginTop:150}}>
                                                <Icon type="frown-o" /> some problems happened in the backend server
                                                <br/>
                                                <Icon type="mail" /> h12345jack@163.com to solve it
                                                </p>
                                            </div>
                                            :
                                            <Output data={data}>
                                            </Output>
                                        }
                                    </Card>
                                </Col>
                            
                        </Row>
                    </div>
                </div>

    }
}

export default SignedGraph;