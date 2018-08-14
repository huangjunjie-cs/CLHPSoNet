import React , {Component} from 'react';
import { Tabs, Col, Row } from 'antd';

import TopPeople from './outputs/part1/topPeople';
import DirectGraph from './outputs/part2/directGraph';
import ForchGraph from './outputs/part3/forchGraph';
import NodeInfo from './outputs/part3/nodeInfo';

import { getPeopleProfile } from '../api'; 

const TabPane = Tabs.TabPane;



class Output extends Component {

    state = {
        selected_node_id: "",
        selected_people: "",
        nodeinfo_loading: false,
        nodeinfo:{},
    }   



    handleSelectedPeople = (node_id, node_name)=>{
        this.setState({
            selected_node_id: node_id,
            selected_people: node_name,
            nodeinfo_loading: true
        },()=>{
            getPeopleProfile(node_id).then(res=>{
                const data= res.data;
                this.setState({
                    nodeinfo_loading: false,
                    nodeinfo: data
                })
            }).catch(err=>{
                this.setState({
                    disabled: true
                })
            })
        })
    }


    render(){
        const {nodes,  links1, links2, links3, link_datas} = this.props.data;
        console.log(nodes, links1, links2, links3)
        let name_dict = {};
        let centrality_data =[];
        let node_list = [];
        for(const key in nodes){
            name_dict[key] = nodes[key].name;
            node_list.push([key, nodes[key].position]);
            centrality_data.push(nodes[key].centrality);
        }
        return node_list.length > 0 ?
                (<div>
                <Tabs tabPosition={"top"}>
                    <TabPane tab="Direct Relationship" key="1">
                    <DirectGraph 
                        name_dict={name_dict}
                        node_list={node_list}
                        links1={links1}
                        links2={links2}
                        links3={links3}
                    />
                    </TabPane>
                    <TabPane tab="Group Partition" key="2">
                    <Row gutter={10}>
                        <Col lg={16} xs={24} id="forced-graph">
                        <ForchGraph 
                            links={links3} 
                            handleSelctedPeople={this.handleSelectedPeople}
                            datas={link_datas}
                        />
                        </Col>
                        <Col lg={8} xs={24}>
                            <NodeInfo 
                                selected_people ={this.state.selected_people}
                                nodeinfo={this.state.nodeinfo}
                                nodeinfo_loading={this.state.nodeinfo_loading}
                            />
                        </Col>
                    </Row>
                    </TabPane>
                    <TabPane tab="Top and Central People" key="0">
                    <TopPeople
                        centrality_data={centrality_data}
                    />
                    </TabPane>

                    
                </Tabs>
                </div>)
                :<div></div>;
                
    }
  
    
}

export default Output;
