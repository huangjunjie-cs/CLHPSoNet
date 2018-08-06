import React, {Component} from 'react';
import {Card, Row, Col, Tag} from 'antd';

class NodeInfo extends Component {
  render () {
    const desc = {
      "PersonId" : "1384",
      "EngName" : "Ouyang Xiu",
      "ChName" : "歐陽修",
      "IndexYear" : "1068",
      "Gender" : "0",
      // "YearBirth" : "",
      "DynastyBirth" : "Unknown",
      "EraBirth" : "Unknown",
      // "EraYearBirth" : "",
      // "YearDeath" : "",
      "DynastyDeath" : "Unknown",
      "EraDeath" : "Unknown",
      // "EraYearDeath" : "",
      "YearsLived" : "66",
      "Dynasty" : "Song",
      "JunWang" : "Changsha",
    };
    const info = (
      <Row>
        <Col span={11} offset={1} style={{marginTop: 10}}>
          <div>
            <img
              alt="example"
              width="100%"
              src="https://upload.wikimedia.org/wikipedia/commons/0/09/%E5%AE%8B%E5%8F%82%E6%94%BF%E6%AC%A7%E9%98%B3%E6%96%87%E5%BF%A0%E5%85%AC%E4%BF%AE.jpg"
            />

          </div>
        </Col>
        <Col span={1} />
        <Col span={11} style={{marginTop: 10}}>
          {Object.entries (desc).map (d => {
            return [<span>{d[0] + ':' + d[1]}</span>, <br />];
          })}
        </Col>
        <Col span={23} offset={1}>
          <div style={{marginTop: 20}}>
            <Tag color="gold">historian</Tag>
            <Tag color="gold">Learned person</Tag>
            <Tag>collector</Tag>
            <Tag color="geekblue">Financial officer</Tag>
            <Tag color="geekblue">Prime Minister</Tag>

          </div>
        </Col>
      </Row>
    );

    return (
      <div>
        <Card title="Ouyang Xiu" hoverable cover={info}>
          <div>
          Ouyang Xiu, courtesy name Yongshu, also known by his art names Zuiweng and Liu Yi Jushi, was a Chinese scholar-official, essayist, historian, poet, calligrapher, and epigrapher of the Song dynasty.
          </div>
        </Card>
      </div>
    );
  }
}

export default NodeInfo;
