import React, {Component} from 'react';
import {Divider, Table} from 'antd';

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

class TopPeople extends Component {
  render () {
    const {pos_tie_num, neg_tie_num, node_num, centrality_data} = this.props;
    console.log(centrality_data, 63);
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
          dataSource={centrality_data}
          size="small"
          pagination={false}
          scroll={{ x: 1050}}
        />
      </div>
    );
  }
}

export default TopPeople;
