import React , {Component} from 'react';
import {Form, Slider, InputNumber, Select, Radio } from 'antd';
import {Row, Col} from 'antd';
import * as d3 from 'd3'

import './graph.css'

const datas = {
    "directed": false,
    "graph": {
        "mode": "static",
        "edge_default": {}
    },
    "links": [{"value": 4.0, "source": "1493", "target": "1384"}, {"value": 4.0, "source": "1384", "target": "1493"}, {"value": 6.0, "source": "1493", "target": "3767"}, {"value": 6.0, "source": "3767", "target": "1493"}, {"value": -1.0, "source": "1493", "target": "1762"}, {"value": -1.0, "source": "1762", "target": "1493"}, {"value": 3.0, "source": "1493", "target": "3762"}, {"value": 3.0, "source": "3762", "target": "1493"}, {"value": 1.0, "source": "1762", "target": "7364"}, {"value": 1.0, "source": "7364", "target": "1762"}, {"value": 0.0, "source": "1762", "target": "3767"}, {"value": 0.0, "source": "3767", "target": "1762"}, {"value": 4.0, "source": "1762", "target": "1384"}, {"value": 4.0, "source": "1384", "target": "1762"}, {"value": 10.0, "source": "3767", "target": "1384"}, {"value": 10.0, "source": "1384", "target": "3767"}, {"value": 4.0, "source": "3767", "target": "3762"}, {"value": 4.0, "source": "3762", "target": "3767"}, {"value": 0.0, "source": "3767", "target": "7364"}, {"value": 0.0, "source": "7364", "target": "3767"}, {"value": 1.0, "source": "7364", "target": "3762"}, {"value": 1.0, "source": "3762", "target": "7364"}, {"value": 7.0, "source": "7364", "target": "1384"}, {"value": 7.0, "source": "1384", "target": "7364"}, {"value": 5.0, "source": "3762", "target": "1384"}, {"value": 5.0, "source": "1384", "target": "3762"}], "nodes": [{"group": 1, "id": "1762", "label": "1762", "name": "Wang Anshi"}, {"group": 2, "id": "1493", "label": "1493", "name": "Su Zhe"}, {"group": 2, "id": "3762", "label": "3762", "name": "Su Xun"}, {"group": 1, "id": "1384", "label": "1384", "name": "Ouyang Xiu"}, {"group": 1, "id": "7364", "label": "7364", "name": "Zeng Gong"}, {"group": 2, "id": "3767", "label": "3767", "name": "Su Shi"}],
    "multigraph": false
}
// const name_dict = {
//     "3762" : 'Su Xun',
//     "1762" : 'Wang Anshi',
//     "7364" : 'Zeng Gong',
//     "1493" : 'Su Zhe',
//     "3767" : 'Su Shi',
//     "1384" : 'Ouyang Xiu'
// }



const color_links = ['-green', '-red', ''];


class ForchGraph extends Component {
    state = {
        width: 800,
        height: 480
    }
  
  componentDidMount(){
    function ticked() {
        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
    
        node
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
        
        node_text.attr("x", function(d) { 
                console.log(d); return d.x; })
                .attr("y", function(d) { return d.y; });
    }
    
    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
      
    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }
      
    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
    
    // console.log(width);

    let parentWidth = d3.select('div#forced-graph')
                        .node()
                        .parentNode.clientWidth;

        parentWidth = parentWidth * (16/24);
    // let parentHeight = d3.select('div#forced-graph').node() .parentNode.clientHeight * (16/24);

    let parentHeight = parentWidth * 0.8;

    const color = d3.scaleOrdinal(d3.schemeCategory20c);
    

        
    const svg = d3.select("svg#result")
                .attr('width', parentWidth)
                .attr('height', parentHeight);

    const gMain = svg.append('g')
    .classed('g-main', true);

    const rect = gMain.append('rect')
    .attr('width', parentWidth)
    .attr('height', parentHeight)
    .style('fill', 'white');

    const gDraw = gMain.append('g');

    const zoom = d3.zoom()
    .on('zoom', zoomed)

    gMain.call(zoom);


    function zoomed() {
        gDraw.attr('transform', d3.event.transform);
    }

    const link = gDraw.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(datas.links)
        .enter().append("line")
        .attr("stroke-width", function(d) { return 1; })
        .attr("class", function(d){
            // console.log(Math.random()%3);
            const pku = d.value > 0 ? '-green': (d.value < 0 ? '-red': '')
            return 'line' + pku;
        });
    
    const node = gDraw.append("g")
        .attr("class", "node")
        .selectAll("circle")
        .data(datas.nodes)
        .enter().append("circle")
        .attr("r", 5)
        .attr("fill", function(d) { 
            return color(d.group); })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));
    
    const node_text = gDraw.append("g")
            .attr("class", "text")
            .selectAll("text")
            .data(datas.nodes)
            .enter().append("text")
            .attr("fill", function(d) { 
                if ('color' in d)
                    return d.color;
                else
                    return color(d.group); 
            })
            .text((d)=>{
                return d.name;
            })
            .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));
    

    node.append('title')
        .text(function(d) {
            return d.name;
        })
    
    const min_edge = d3.min(datas.links.map(d=> d.value));

    const simulation = d3.forceSimulation()
        .force("link", d3.forceLink()
                .id(function(d) { return d.id;})
                .distance(function(d){
                    const  dist = 200 / (d.value - min_edge + 1);
                        
                    return dist; 
                })
            )
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(parentWidth / 2, parentHeight / 2))
            .force("x", d3.forceX(parentWidth/2))
            .force("y", d3.forceY(parentHeight/2));

    simulation
        .nodes(datas.nodes)
        .on("tick", ticked)

    simulation.force("link")
        .links(datas.links);

    rect.on('click', () => {
        console.log('here');
        node.each(function(d) {
            console.log(d);
            d.selected = false;
            d.previouslySelected = false;
        });
        node.classed("selected", false);
    });
    

    }

  
    render(){
        return (<svg  id="result">
                </svg>)
    }
    
};

export default ForchGraph;
