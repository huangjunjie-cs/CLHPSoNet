import React , {Component} from 'react';
import {Form, Slider, InputNumber, Select, Radio, Button } from 'antd';
import {Row, Col} from 'antd';

// import {getNodeList} from 'src/api';

const Option = Select.Option;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;



const children = [];
const nodes = [
  ['欧阳修','1384'],
  ['苏洵','3762'],
  ['苏辙','1493'],
  ['苏轼','3767'],
  ['王安石','1762'],
  ['曾巩','7364'],
]

class NameInput extends Component {

  state = {
    people: ['1384', '3762','1493','3767', '1762', '7364'],
    algorithm: 1,
    depth: 0
  }

  handlePeopleChange = (value)=>{
    this.setState({
      people: value
    })
  }

  handleAlgorithmChange = (e)=>{
    const algorithm = e.target ? e.target.value : e;
    this.setState({
      algorithm
    })
  }

  handleDepthChange = (e)=>{
    const depth = e.target ? e.target.value : e;
    this.setState({
      depth
    })
  }

  handleSubmit = ()=>{
    console.log()
  }

  handleReset = ()=>{
    this.setState({
      people: ['1384', '3762','1493','3767', '1762', '7364'],
      algorithm: 1,
      depth: 0
    });
  }

  componentWillMount(){
    for (let i = 0; i < nodes.length; i++) {
      children.push(<Option key={nodes[i][1]}>{nodes[i][0]}</Option>);
    }
  }

  render(){
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    // const formItemLayout = {
    //   labelCol: {
    //     xs: { span: 24 },
    //     sm: { span: 6 },
    //   },
    //   wrapperCol: {
    //     xs: { span: 24 },
    //     sm: { span: 18 },
    //   },
    // };
    return (<div>
        <Form onSubmit={this.handleSubmit}>
          <FormItem label="People">
            <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Please select"
                defaultValue={['1384', '3762','1493','3767', '1762', '7364']}
                onChange={this.handlePeopleChange}
              >
              {children}
            </Select>
          </FormItem>
          <FormItem label="Depth" >
          <Row>
            <Col span={16}>
            <Slider min={1} max={4} onChange={this.handleDepthChange} value={this.state.depth} />
            </Col>
            <Col span={8}>
            <InputNumber
                min={0}
                max={3}
                style={{ width: '80%', marginLeft: '20%' }}
                value={this.state.depth}
                onChange={this.handleDepthChange}
              />
            </Col>
          </Row>
          </FormItem>
          <FormItem label="Algorithm">
              <RadioGroup onChange={this.handleAlgorithmChange} value={this.state.algorithm}>
                <Radio style={radioStyle} value={1}>Community Detection</Radio>
                <Radio style={radioStyle} value={2} disabled>Graph Partition</Radio>
                <Radio style={radioStyle} value={3} disabled>Network Embedding</Radio>
              </RadioGroup>
          </FormItem>
          <Row>
            <Col span={8}>
              <Button type="primary">CONFIRM</Button>
            </Col>
            <Col span={8} offset={8}>
              <Button onClick={this.handleReset}>RESET</Button>
            </Col>
            </Row>
        </Form>
      </div>)
  }
}

export default NameInput;
