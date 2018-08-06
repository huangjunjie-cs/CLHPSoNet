import React, {Component} from 'react';
import {Row, Col, Divider, Table} from 'antd';

const columns = [
  {
    title: 'EngName',
    dataIndex: 'EngName',
    width: 100,
    fixed: 'left',
    align: 'center'
  },
  {
    title: 'ChName',
    dataIndex: 'ChName',
    width: 100,
    fixed: 'left',
    align: 'center'
  },
  {
    title: 'PersonID',
    dataIndex: 'PersonID',
    render: (value, row, index) => (
      <a href={`https://cbdb.fas.harvard.edu/cbdbapi/person.php?id=${value}`}>
        {value}
      </a>
    ),
    width: 100,
    align: 'center'
  },
  {
    dataIndex: 'c1',
    title: <div><span>Degree</span><br /><span>Centrality</span></div>,
    sorter: (a, b) => a.c1 - b.c1,
    width: 200,
    align: 'center'
  },
  {
    dataIndex: 'c2',
    title: <div><span>Betweeness</span><br /><span>Centrality</span></div>,
    sorter: (a, b) => a.c2 - b.c2,
    width: 200,
    align: 'center'
  },
  {
    dataIndex: 'c3',
    title: <div><span>Closeness</span><br /><span>Centrality</span></div>,
    sorter: (a, b) => a.c3 - b.c3,
    width: 200,
    align: 'center'
  },
  {
    dataIndex: 'c4',
    title: <div><span>Eigenvector</span><br /><span>Centrality</span></div>,
    sorter: (a, b) => a.c3 - b.c3,
    width: 200,
    align: 'center'
  },
];

const data = [
  {
    c1: 0.029,
    c2: 0.083,
    PersonID: '3767',
    c4: 0.179,
    EngName: 'Su Shi',
    ChName: '\u8607\u8efe',
    c3: 0.38,
  },
  {
    c1: 0.025,
    c2: 0.054,
    PersonID: '1762',
    c4: 0.138,
    EngName: 'Wang Anshi',
    ChName: '\u738b\u5b89\u77f3',
    c3: 0.361,
  },
  {
    c1: 0.022,
    c2: 0.046,
    PersonID: '1384',
    c4: 0.135,
    EngName: 'Ouyang Xiu',
    ChName: '\u6b50\u967d\u4fee',
    c3: 0.362,
  },
  {
    c1: 0.011,
    c2: 0.019,
    PersonID: '7364',
    c4: 0.062,
    EngName: 'Zeng Gong',
    ChName: '\u66fe\u978f',
    c3: 0.335,
  },
  {
    c1: 0.007,
    c2: 0.009,
    PersonID: '1493',
    c4: 0.07,
    EngName: 'Su Zhe',
    ChName: '\u8607\u8f4d',
    c3: 0.338,
  },
  {
    c1: 0.002,
    c2: 0.001,
    PersonID: '3762',
    c4: 0.024,
    EngName: 'Su Xun',
    ChName: '\u8607\u6d35',
    c3: 0.292,
  },
];

// 蘇軾 , Su Shi , 3767 , 0.029,0.083,0.38,0.179
// 王安石 , Wang Anshi , 1762 , 0.025,0.054,0.361,0.138
// 歐陽修 , Ouyang Xiu , 1384 , 0.022,0.046,0.362,0.135
// 曾鞏 , Zeng Gong , 7364 , 0.011,0.019,0.335,0.062
// 蘇轍 , Su Zhe , 1493 , 0.007,0.009,0.338,0.07
// 蘇洵 , Su Xun , 3762 , 0.002,0.001,0.292,0.024
class TopPeople extends Component {
  render () {
    const {pos_tie_num, neg_tie_num, node_num} = this.props;

    return (
      <div>

        <Divider orientation="left"><h3>Subgraph Info</h3></Divider>
        <div>
          {`A total of ${node_num} nodes are included, `}
          {`The number of Positive tie: ${pos_tie_num}, `}
          {`The number of Negative tie: ${neg_tie_num}.   `}
        </div>
        <Divider orientation="left">
          <h3>Centrality of given People</h3>
        </Divider>
        <Table
          columns={columns}
          dataSource={data}
          size="small"
          pagination={false}
          scroll={{ x: 1050}}
        />
      </div>
    );
  }
}

export default TopPeople;
