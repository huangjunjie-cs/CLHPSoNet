import React, {Component} from 'react';
import {Card, Col, Row} from 'antd';
import {Divider} from 'antd';

import OriginGraph from './components/originGraph';
import LinkInfo from './components/linkInfo';

const node_list = [
  ['3762', [-0.49999989, -0.86602541]],
  ['1762', [0.49999998, 0.86602546]],
  ['7364', [-9.99999970e-1, -6.29182054e-8]],
  ['1493', [1.00000000, 2.45045699e-8]],
  ['3767', [-0.50000004, 0.8660254]],
  ['1384', [0.49999992, -0.86602541]],
];

const name_dict = {
  '3762': 'Su Xun',
  '1762': 'Wang Anshi',
  '7364': 'Zeng Gong',
  '1493': 'Su Zhe',
  '3767': 'Su Shi',
  '1384': 'Ouyang Xiu',
};

const nodes = [
  {
    label: '1762',
    id: '1762',
    name: '1762',
  },
  {
    label: '1493',
    id: '1493',
    name: '1493',
  },
  {
    label: '3762',
    id: '3762',
    name: '3762',
  },
  {
    label: '1384',
    id: '1384',
    name: '1384',
  },
  {
    label: '7364',
    id: '7364',
    name: '7364',
  },
  {
    label: '3767',
    id: '3767',
    name: '3767',
  },
];

const links = [
  {
    source: '1493',
    weight: 4.0,
    target: '1384',
    id: '25787',
  },
  {
    source: '1493',
    weight: 6.0,
    target: '3767',
    id: '25812',
  },
  {
    source: '1493',
    weight: -1.0,
    target: '1762',
    id: '10312',
  },
  {
    source: '1493',
    weight: 3.0,
    target: '3762',
    id: '24000',
  },
  {
    source: '1762',
    weight: 1.0,
    target: '7364',
    id: '10285',
  },
  {
    source: '1762',
    weight: 0.0,
    target: '3767',
    id: '10267',
  },
  {
    source: '1762',
    weight: 4.0,
    target: '1384',
    id: '10042',
  },
  {
    source: '3767',
    weight: 10.0,
    target: '1384',
    id: '26871',
  },
  {
    source: '3767',
    weight: 4.0,
    target: '3762',
    id: '24001',
  },
  {
    source: '3767',
    weight: 0.0,
    target: '7364',
    id: '27449',
  },
  {
    source: '7364',
    weight: 1.0,
    target: '3762',
    id: '24008',
  },
  {
    source: '7364',
    weight: 7.0,
    target: '1384',
    id: '26968',
  },
  {
    source: '3762',
    weight: 5.0,
    target: '1384',
    id: '24003',
  },
];

const links2 = [
  {
    source: '1762',
    target: '7364',
    id: '8814',
    weight: 1.0,
  },
  {
    source: '1762',
    target: '1384',
    id: '8613',
    weight: 5.0,
  },
  {
    source: '1762',
    target: '3767',
    id: '8796',
    weight: 1.0,
  },
  {
    source: '1493',
    target: '3767',
    id: '22706',
    weight: 6.0,
  },
  {
    source: '1493',
    target: '3762',
    id: '21310',
    weight: 3.0,
  },
  {
    source: '1493',
    target: '1384',
    id: '22712',
    weight: 4.0,
  },
  {
    source: '3762',
    target: '1384',
    id: '21313',
    weight: 5.0,
  },
  {
    source: '3762',
    target: '7364',
    id: '21319',
    weight: 1.0,
  },
  {
    source: '3762',
    target: '3767',
    id: '21311',
    weight: 4.0,
  },
  {
    source: '1384',
    target: '7364',
    id: '23479',
    weight: 7.0,
  },
  {
    source: '1384',
    target: '3767',
    id: '23474',
    weight: 10.0,
  },
];

const links3 = [
  {
    id: '1249',
    weight: 0.0,
    source: '1493',
    target: '3767',
  },
  {
    id: '1247',
    weight: -1.0,
    source: '1493',
    target: '1762',
  },
  {
    id: '3826',
    weight: 0.0,
    source: '1384',
    target: '3767',
  },
  {
    id: '1618',
    weight: 0.0,
    source: '1384',
    target: '3762',
  },
  {
    id: '2984',
    weight: 0.0,
    source: '1384',
    target: '7364',
  },
  {
    id: '4466',
    weight: -1.0,
    source: '1384',
    target: '1762',
  },
  {
    id: '2981',
    weight: 0.0,
    source: '3767',
    target: '7364',
  },
  {
    id: '3850',
    weight: -1.0,
    source: '3767',
    target: '1762',
  },
  {
    id: '2986',
    weight: 0.0,
    source: '1762',
    target: '7364',
  },
];

// const relations = [{
//     "X" : "王安石",
//     "Y" : "歐陽修",
//     "AssocCode" : "14",
//     "AssocName" : "被Y推薦",
//     "Year" : "",
//     "TextTitle" : "[n/a]",
//     "KinPersonId" : "0",
//     "KinPersonName" : "",
//     "KinRelName" : "未詳",
//     "AssocKinPersonId" : "0",
//     "AssocKinPersonName" : "",
//     "AssocKinRelName" : "未詳",
//     "Source" : "宋人傳記資料索引(電子版)",
//     "Pages" : "",
//     "Notes" : ""
// },{
//     "X" : "王安石",
//     "Y" : "歐陽修",
//     "AssocCode" : "14",
//     "AssocName" : "被Y推薦",
//     "Year" : "0",
//     "TextTitle" : "蔗王安石劄子 / 歐陽文忠公集",
//     "KinPersonId" : "0",
//     "KinPersonName" : "",
//     "KinRelName" : "未詳",
//     "AssocKinPersonId" : "0",
//     "AssocKinPersonName" : "",
//     "AssocKinRelName" : "未詳",
//     "Source" : "宋人傳記資料索引(電子版)",
//     "Pages" : "1536",
//     "Notes" : ""
// },{
//     "X" : "王安石",
//     "Y" : "歐陽修",
//     "AssocCode" : "61",
//     "AssocName" : "不合",
//     "Year" : "",
//     "TextTitle" : "與韓琦同心輔政 熙寧初 與王安石議不合 以太子少師致仕歸 五年閏七月卒",
//     "KinPersonId" : "0",
//     "KinPersonName" : "",
//     "KinRelName" : "未詳",
//     "AssocKinPersonId" : "0",
//     "AssocKinPersonName" : "",
//     "AssocKinRelName" : "未詳",
//     "Source" : "宋人傳記資料索引(電子版)",
//     "Pages" : "20692",
//     "Notes" : "與韓琦同心輔政 熙寧初 與王安石議不合 以太子少師致仕歸 五年閏七月卒"
// },{

//     "X" : "王安石",
//     "Y" : "歐陽修",
//     "AssocCode" : "145",
//     "AssocName" : "為Y作祭文",
//     "Year" : "1080",
//     "TextTitle" : "[n/a]",
//     "KinPersonId" : "0",
//     "KinPersonName" : "",
//     "KinRelName" : "未詳",
//     "AssocKinPersonId" : "0",
//     "AssocKinPersonName" : "",
//     "AssocKinRelName" : "未詳",
//     "Source" : "未知",
//     "Pages" : "",
//     "Notes" : ""
// },{

//     "X" : "王安石",
//     "Y" : "歐陽修",
//     "AssocCode" : "145",
//     "AssocName" : "為Y作祭文",
//     "Year" : "",
//     "TextTitle" : "祭歐陽文忠公文 / 歐陽文忠公集",
//     "KinPersonId" : "0",
//     "KinPersonName" : "",
//     "KinRelName" : "未詳",
//     "AssocKinPersonId" : "0",
//     "AssocKinPersonName" : "",
//     "AssocKinRelName" : "未詳",
//     "Source" : "宋人傳記資料索引(電子版)",
//     "Pages" : "20692",
//     "Notes" : "祭歐陽文忠公文 / 歐陽文忠公集"
// },{

//     "X" : "王安石",
//     "Y" : "歐陽修",
//     "AssocCode" : "434",
//     "AssocName" : "收到Y的啓",
//     "Year" : "",
//     "TextTitle" : "賀王相公安石拜相啟",
//     "KinPersonId" : "0",
//     "KinPersonName" : "",
//     "KinRelName" : "未詳",
//     "AssocKinPersonId" : "0",
//     "AssocKinPersonName" : "",
//     "AssocKinRelName" : "未詳",
//     "Source" : "全宋文",
//     "Pages" : "33.166",
//     "Notes" : "(Assoc count=1)"
// },{
//     "Y" : "王安石",
//     "X" : "歐陽修",
//     "AssocCode" : "13",
//     "AssocName" : "推薦",
//     "Year" : "0",
//     "TextTitle" : "蔗王安石劄子 / 歐陽文忠公集",
//     "KinPersonId" : "0",
//     "KinPersonName" : "",
//     "KinRelName" : "未詳",
//     "AssocKinPersonId" : "0",
//     "AssocKinPersonName" : "",
//     "AssocKinRelName" : "未詳",
//     "Source" : "宋人傳記資料索引(電子版)",
//     "Pages" : "1536",
//     "Notes" : ""
// }
// ]

const relations = [
  {
    Pages: '',
    Y: 'Ouyang Xiu',
    AssocName: 'Recommended by Y',
    AssocKinPersonId: '0',
    AssocCode: '14',
    AssocKinPersonName: '',
    AssocKinRelName: 'unknown',
    X: 'Wang Anshi',
    KinRelName: 'unknown',
    KinPersonName: '',
    KinPersonId: '0',
    Source: "Song People's Biographical Information Index (Electronic Version)",
    Year: '',
    TextTitle: '[n/a]',
    Notes: '',
  },
  {
    Pages: '1536',
    Y: 'Ouyang Xiu',
    AssocName: 'Recommended by Y',
    AssocKinPersonId: '0',
    AssocCode: '14',
    AssocKinPersonName: '',
    AssocKinRelName: 'unknown',
    X: 'Wang Anshi',
    KinRelName: 'unknown',
    KinPersonName: '',
    KinPersonId: '0',
    Source: "Song People's Biographical Information Index (Electronic Version)",
    Year: '0',
    TextTitle: 'Cane Wang Anshi Zakizi / Ouyang Wenzhong Collection',
    Notes: '',
  },
  {
    Pages: '20692',
    Y: 'Ouyang Xiu',
    AssocName: 'Not fit',
    AssocKinPersonId: '0',
    AssocCode: '61',
    AssocKinPersonName: '',
    AssocKinRelName: 'unknown',
    X: 'Wang Anshi',
    KinRelName: 'unknown',
    KinPersonName: '',
    KinPersonId: '0',
    Source: "Song People's Biographical Information Index (Electronic Version)",
    Year: '',
    TextTitle: "Concerned with Han Qi's Conscientious Assistant Secretary Xi Ningchu and Wang Anshi\u2019s Proposal",
    Notes: "Concerned with Han Qi's Conscientious Assistant Secretary Xi Ningchu and Wang Anshi\u2019s Proposal",
  },
  {
    Pages: '',
    Y: 'Ouyang Xiu',
    AssocName: 'For Y',
    AssocKinPersonId: '0',
    AssocCode: '145',
    AssocKinPersonName: '',
    AssocKinRelName: 'unknown',
    X: 'Wang Anshi',
    KinRelName: 'unknown',
    KinPersonName: '',
    KinPersonId: '0',
    Source: 'unknown',
    Year: '1080',
    TextTitle: '[n/a]',
    Notes: '',
  },
  {
    Pages: '20692',
    Y: 'Ouyang Xiu',
    AssocName: 'For Y',
    AssocKinPersonId: '0',
    AssocCode: '145',
    AssocKinPersonName: '',
    AssocKinRelName: 'unknown',
    X: 'Wang Anshi',
    KinRelName: 'unknown',
    KinPersonName: '',
    KinPersonId: '0',
    Source: "Song People's Biographical Information Index (Electronic Version)",
    Year: '',
    TextTitle: 'Sacrifice Ouyang Wenzhong Official Document / Ouyang Wenzhong Collection',
    Notes: 'Sacrifice Ouyang Wenzhong Official Document / Ouyang Wenzhong Collection',
  },
  {
    Pages: '33.166',
    Y: 'Ouyang Xiu',
    AssocName: "Received Y's",
    AssocKinPersonId: '0',
    AssocCode: '434',
    AssocKinPersonName: '',
    AssocKinRelName: 'unknown',
    X: 'Wang Anshi',
    KinRelName: 'unknown',
    KinPersonName: '',
    KinPersonId: '0',
    Source: 'Song Wenwen',
    Year: '',
    TextTitle: 'He Wangxiang Public Security',
    Notes: '(Assoc count=1)',
  },
  {
    Pages: '1536',
    Y: 'Wang Anshi',
    AssocName: 'recommend',
    AssocKinPersonId: '0',
    AssocCode: '13',
    AssocKinPersonName: '',
    AssocKinRelName: 'unknown',
    X: 'Ouyang Xiu',
    KinRelName: 'unknown',
    KinPersonName: '',
    KinPersonId: '0',
    Source: "Song People's Biographical Information Index (Electronic Version)",
    Year: '0',
    TextTitle: 'Cane Wang Anshi Zakizi / Ouyang Wenzhong Collection',
    Notes: '',
  },
];

class DirectGraph extends Component {
  state = {
    x: 'Wang Anshi',
    y: 'Ouyang Xiu',
  };

  render () {
    return (
      <div>
        <Divider orientation="left"><h3>DirectGraph</h3></Divider>
        <Row gutter={16}>
          <Col lg={8} xs={24}>
            <Card title="Positive Tie" style={{textAlign: 'center'}}>
              <OriginGraph
                key={1}
                node_list={node_list}
                name_dict={name_dict}
                links={links2}
              />
            </Card>
          </Col>
          <Col lg={8} xs={24}>
            <Card title="Negative Tie" style={{textAlign: 'center'}}>
              <OriginGraph
                key={2}
                node_list={node_list}
                name_dict={name_dict}
                links={links3}
              />
            </Card>
          </Col>
          <Col lg={8} xs={24}>
            <Card title="Signed Graph" style={{textAlign: 'center'}}>
              <OriginGraph
                key={3}
                node_list={node_list}
                name_dict={name_dict}
                links={links}
              />
            </Card>
          </Col>
        </Row>
        <Divider orientation="left"><h3>LinkInfo</h3></Divider>
        <LinkInfo x={this.state.x} y={this.state.y} relations={relations} />
      </div>
    );
  }
}

export default DirectGraph;
