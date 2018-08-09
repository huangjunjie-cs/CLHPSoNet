import React, { Component } from 'react';
import {Row, Col} from 'antd';
import { Card, Icon } from 'antd';
import ReactMarkdown from 'react-markdown';

import Input from '../components/input';
import Output from '../components/output';

import './css/md.css';

const title_md = `
## Signed Graph Analysis for Song Dynasty
`

class SignedGraph extends Component {
    state = {
        input: {},
        data: {},
        loading: false,
        disabled: false
    }


    render() {
        return <div> 
                    <div className="markdown-body"> 
                        <ReactMarkdown source={title_md} escapeHtml={false}/>
                    </div>
                    <div style={{marginLeft: 20, marginRight: 20, marginTop: 20, padding:10,background: '#ECECEC'}}>
                        <Row gutter={20}>
                                <Col md={6} xs={24}>
                                    <Card title='Input'>
                                        <Input />
                                    </Card>
                                </Col>
                                
                                <Col md={18} xs={24}>
                                    <Card title='Output'>
                                        {this.state.disabled 
                                            ? <div style={{minHeight:180, textAlign:'center'}}>
                                                <p style={{marginTop:150}}>
                                                <Icon type="frown-o" /> some problems happened in the backend server
                                                <br/>
                                                <Icon type="mail" /> h12345jack@163.com to solve it
                                                </p>
                                            </div>
                                            :
                                            <Output data={this.state.data}>
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