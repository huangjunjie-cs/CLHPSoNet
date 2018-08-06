import React , {Component} from 'react';
import {Form, Slider, InputNumber, Select, Radio } from 'antd';
import {Row, Col} from 'antd';

import "./graph.css";

class OriginGraph extends Component {

  render(){
    const {name_dict, node_list, links} = this.props;
    console.log(links);
    const margin = 20;
    const width = 200;
    let node_dict = {}

    const nodes = node_list.map(item=>{
      node_dict[item[0]] = {x : item[1][0] * width/2 + width/2, y: item[1][1]*width/2 + width/2}
      return <text x={item[1][0] * width/2 + width/2 - width/12} y={item[1][1]*width/2 + width/2} fontFamily="Verdana" fontSize="10">
               {name_dict[item[0]]}
             </text>
      // return [<circle cx={item[1][0] * width/2 + width/2} cy={item[1][1]*width/2 + width/2} r="3" />,
      //        <text x={item[1][0] * width/2 + width/2 - width/12} y={item[1][1]*width/2 + width/2} font-family="Verdana" font-size="10">
      //         {item[0]}
      //       </text>]
    })

    const lines = links.map(item=>{
      const node1 = node_dict[item.source]
      const node2 = node_dict[item.target]
      if(item.weight > 0){
        // const angle = Math.abs(Math.atan((node2.y - node1.y)/(node2.x - node1.x))) * 360 / Math.PI;
        const text_pos = {x: (node1.x + node2.x) /2, y:(node1.y + node2.y) /2};
        return [<line
                  x1={node1.x} 
                  y1={node1.y} 
                  x2={node2.x} 
                  y2={node2.y} 
                  className="line-green" 
                />,
                 <text
                    x={text_pos.x} 
                    y={text_pos.y} 
                    fill= "rgb(0,255,0)" 
                    font-size="10"
                  >
                  {item.weight.toFixed(1)}
                 </text>
               ]
        
      }else if(item.weight < 0){
        const text_pos = {x: (node1.x + node2.x) /2, y:(node1.y + node2.y) /2};
        return [<line 
                  x1={node1.x} 
                  y1={node1.y} 
                  x2={node2.x} 
                  y2={node2.y} 
                  className="line-red" 
                />,
                <text
                    x={text_pos.x} 
                    y={text_pos.y} 
                    fill= "rgb(255,0,0)" 
                    font-size="10"
                  >
                  {item.weight.toFixed(1)}
                </text>
              ]
        
      }else{
        return <line 
                  x1={node1.x} 
                  y1={node1.y} 
                  x2={node2.x}
                  y2={node2.y}
                  className="line"
                />
      }
    })
    return <div>
        <svg width={width + margin} height={width + margin}>
         <g transform={"translate(" + margin/2 + "," + margin/2 + ")"}>
          {lines}
          {nodes}
        </g>
        </svg>
      </div>
  }
  
    
}

export default OriginGraph;
